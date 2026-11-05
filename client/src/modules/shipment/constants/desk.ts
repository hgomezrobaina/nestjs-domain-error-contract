// Mirrors the server's in-memory seed, so the desk can pick every case.
export const SHIPMENTS = [
  { id: "s-light", label: "s-light · 12 kg → PT" },
  { id: "s-heavy", label: "s-heavy · 32 kg → ES" },
  { id: "s-iceland", label: "s-iceland · 5 kg → IS" },
  { id: "s-sent", label: "s-sent · already dispatched" },
]

export const CARRIERS = [
  { id: "c-road", label: "c-road · up to 30 kg, ES/PT/FR" },
  { id: "c-busy", label: "c-busy · rate-limits us" },
  { id: "c-offline", label: "c-offline · unreachable" },
  { id: "c-broken", label: "c-broken · answers with an error" },
]
