# nestjs-domain-error-contract

A domain exception that crosses the API boundary is a stable identifier with data, not a sentence. The server names what failed and attaches what is needed to explain it; the client, which knows the screen and the reader's language, writes the sentence.

This repository is the runnable companion of the article _Excepciones de dominio entre NestJS y React: un identificador con datos, no una frase_. A NestJS server and a React client that agree on one error contract, and the tests that hold both sides to it.

## The contract

Every failure, wherever it comes from, leaves the server with the same shape:

```json
{
  "time": "2026-11-05T14:52:51.428Z",
  "path": "/shipments/dispatch",
  "status": 409,
  "error": {
    "message": "The shipment weight exceeds what the carrier accepts",
    "status": 409,
    "code": "shipment-weight-exceeded",
    "params": [
      { "name": "maxWeight", "value": "30" },
      { "name": "actual", "value": "32" }
    ]
  }
}
```

- `code` identifies the failure. The client recognises by `code` and nothing else.
- `params` carries the failure data as named pairs, apart from any text.
- `message` is for the log and for clients that do not know the code yet. This client never paints it.

[`contract/fixtures/`](contract/fixtures) pins every body the server sends. The server tests assert the real application produces them; the client tests feed those same bodies to the real HTTP layer.

## Run it

```bash
npm install
npm test               # both sides
npm run start:server   # http://localhost:3000
npm run dev:client     # http://localhost:5173
```

The desk lets you pick a shipment and a carrier and dispatch or print a label. The first eight failures in the table below are reachable from it (the throttled dispatch takes 101 clicks in a minute), and the ES/EN switch shows that the sentence is resolved where it is painted. The not-found and unexpected rows are only reachable from the tests: the desk never offers a shipment or carrier that does not exist.

## What fails, and how each side reads it

| Code                                      | Status | Params                | Thrown by                              | Client sentence                                            |
| ----------------------------------------- | ------ | --------------------- | -------------------------------------- | ---------------------------------------------------------- |
| `shipment-weight-exceeded`                | 409    | `maxWeight`, `actual` | dispatch                               | _This shipment weighs 32 kg and the carrier accepts 30._   |
| `shipment-already-dispatched`             | 409    | —                     | dispatch, print label                  | _This shipment has already been dispatched._               |
| `destination-not-covered`                 | 422    | `country`             | dispatch                               | _This carrier does not deliver to IS. Choose another one._ |
| `too-many-requests`                       | 429    | —                     | the throttler, on dispatch             | _Too many attempts. Try again in a few minutes._           |
| `too-many-requests`                       | 429    | —                     | the throttler, on print label          | _You have printed the three labels this hour allows._      |
| `carrier-rate-limit`                      | 502    | —                     | print label                            | _The carrier did not respond. Please try again._           |
| `carrier-connection-error`                | 502    | —                     | print label                            | same sentence                                              |
| `carrier-error`                           | 502    | —                     | print label                            | same sentence                                              |
| `shipment-not-found`, `carrier-not-found` | 404    | —                     | both                                   | not mirrored: the operation's default                      |
| `not-found` (any unknown route)           | 404    | —                     | Nest, code derived from the status     | not mirrored: the operation's default                      |
| `internal-server-error`                   | 500    | —                     | anything the filter does not recognise | not mirrored: the operation's default                      |

Two rows prove the map from code to sentence is not one to one in either direction. `too-many-requests` has two sentences, because two limits answer with the same code and only the client knows which operation failed. The three carrier codes have one, because they are three investigations in the log and one problem on the screen.

## Where things are

```
server/src/modules/
├── app/
│   ├── domain/exception/
│   │   ├── app-http.exception.ts            # the contract
│   │   └── app-error-response.exception.ts  # the shape of the error in the body
│   └── infrastructure/nest/
│       ├── filters/http-error.filter.ts          # the global filter
│       └── module/app.module.ts                  # the two limits
├── shipment/
│   ├── domain/exceptions/shipment.exception.ts
│   └── application/use-cases/                    # where the exceptions are thrown
└── carrier/
    ├── domain/exceptions/carrier.exception.ts
    └── infrastructure/memory/fake-carrier.gateway.ts

client/src/modules/
├── app/
│   ├── domain/exceptions/
│   │   ├── app-http-exception.ts            # the mirror
│   │   ├── app-http-error-resolver.ts       # one catalogue per operation
│   │   └── common-http-exceptions.ts
│   └── modules/http/                             # the client's boundary
├── shipment/
│   ├── domain/exceptions/shipment-exceptions.ts
│   └── services/                                 # each operation declares its catalogue
└── carrier/domain/exceptions/carrier-exceptions.ts
```

## NestJS 12 and `errorCode`

Since version 12, `HttpException` accepts an `errorCode` and serialises it in the body. [`nest-error-code.test.ts`](server/src/__test__/nest-error-code.test.ts) shows both halves of what that gives you: the code reaches the client, and the failure data does not, because the only other options are `cause`, which is never serialised, and `description`. That missing slot for the data is what the contract above adds.

## Deliberate trade-offs

- **The two catalogues are written by hand and nothing checks one against the other.** A new server code that deserved its own sentence degrades silently to the operation's `default()`. The fixtures pin the _shape_ of the contract, not the catalogues.
- **A catalogue can hide its own entry.** `find` returns the first match, so the print-label catalogue declares its own `too-many-requests` and must not spread `COMMON_HTTP_EXCEPTIONS` ahead of it, or the generic sentence wins.
- **A resolved error is the catalogue entry itself.** The mirror receives its params through `setParams` after recognising, and the resolver returns that same instance to the UI, so it reads the params of the last failure it resolved. That is why every catalogue builds its entries with `new` on each resolution; the shared sets that are spread (`COMMON_HTTP_EXCEPTIONS`, `CARRIER_HTTP_EXCEPTIONS`) only hold entries without params.
- **The client needs updating to know a new code.** Until it is, the code falls back to the operation's default. The server `message` stays in the contract as the next fallback for clients that choose to paint it.

## Versions

Built and tested on 2026-11-05 with Node 24.18, `@nestjs/common` 12.3.3, `@nestjs/throttler` 6.7.1, TypeScript 6.0.3, React 19.3, Vite 8.3 and Vitest 5.1.

The server tests run on SWC through `unplugin-swc`, because Nest reads constructor dependencies from decorator metadata and esbuild does not emit it.
