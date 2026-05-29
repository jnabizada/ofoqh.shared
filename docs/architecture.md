# Architecture

The workflow diagnostics stack is split into:

- core backend contracts and parsers
- framework-specific backend integration helpers
- frontend contract types and formatting helpers
- shared docs and JSON schemas

Product repositories keep only their service-specific integration code.
