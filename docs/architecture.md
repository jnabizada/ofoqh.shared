# Architecture

`ofoqh.shared` owns reusable packages that should not live in one product repo.

Today that is split into:

- core backend contracts and parsers
- framework-specific backend integration helpers
- frontend contract types and formatting helpers
- frontend platform packages such as Angular tenant-routing/auth primitives
- shared docs and JSON schemas

Product repositories keep only product-specific integration code.
