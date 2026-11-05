# The contract, pinned

Each file is a response body exactly as the server sends it, minus `time`.

- The **server** tests assert that the real application produces these bodies.
- The **client** tests feed these same bodies to the client's HTTP layer.

If the server changes the shape of the contract, the server tests fail against
these files. What they do not check is the _catalogues_: a new code on the server
that deserved its own sentence on the client still degrades silently to the
operation's `default()`. That is a deliberate trade-off, not something this
folder fixes.
