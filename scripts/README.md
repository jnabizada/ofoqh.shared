# Scripts

Helper scripts in this folder are the supported way to publish shared packages
from `ofoqh.shared` to the cluster registries.

Use these registries only:

- BaGetter: `https://bagetter.dev-test.careerpath.ofoqh.com/v3/index.json`
- Verdaccio: `https://verdaccio.dev-test.careerpath.ofoqh.com/`

## Files

### `build-ux.sh`

Builds the Angular UX package without publishing it.

Output:

- `./dist/ofoqh-ux`

Example:

```bash
bash ./scripts/build-ux.sh
```

### `publish-bagetter.sh`

Publishes the .NET workflow diagnostics packages to BaGetter.

Default behavior:

- packs and publishes both:
  - `Ofoqh.Workflow.Diagnostics`
  - `Ofoqh.Workflow.Diagnostics.AspNetCore`

Selective behavior:

```bash
bash ./scripts/publish-bagetter.sh workflow-diagnostics
bash ./scripts/publish-bagetter.sh workflow-diagnostics-aspnetcore
bash ./scripts/publish-bagetter.sh workflow-diagnostics workflow-diagnostics-aspnetcore
```

Environment variables:

- `BAGETTER_SOURCE_URL`
- `BAGETTER_API_KEY`

Notes:

- `all` is the default when no target is passed.
- packages are pushed with `--skip-duplicate`.

### `publish-verdaccio.sh`

Publishes the npm shared packages to Verdaccio.

Default behavior:

- builds and publishes all supported npm packages:
  - `workflow-diagnostics`
  - `angular-tenant`
  - `ux`

Selective behavior:

```bash
bash ./scripts/publish-verdaccio.sh workflow-diagnostics
bash ./scripts/publish-verdaccio.sh angular-tenant
bash ./scripts/publish-verdaccio.sh ux
bash ./scripts/publish-verdaccio.sh workflow-diagnostics ux
```

Environment variables:

- `VERDACCIO_REGISTRY_URL`

Important rules:

- Angular packages must be published from `dist/...`, never from `npm/...`.
- `publish-verdaccio.sh` builds the required package first.
- `publish-verdaccio.sh` runs `verify-dist-package.sh` before publishing Angular packages.

Why this matters:

- publishing from source instead of `dist/...` can create a broken package that
  installs but is missing generated output like `types/` and `fesm2022/`

### `unpublish-verdaccio.sh`

Removes exact npm package versions from Verdaccio.

Examples:

```bash
bash ./scripts/unpublish-verdaccio.sh @ofoqh/ux@0.0.9
bash ./scripts/unpublish-verdaccio.sh ux@0.0.9
bash ./scripts/unpublish-verdaccio.sh angular-tenant@0.0.2 workflow-diagnostics@0.0.2
```

Supported aliases:

- `ux`
- `angular-tenant`
- `workflow-diagnostics`

Rules:

- exact versions only
- whole-package unpublish is intentionally blocked
- invalid aliases fail fast

### `verify-dist-package.sh`

Validates a built Angular dist package before publish.

It checks for:

- `package.json`
- `module`
- `typings`
- `exports["."]`
- `type=module`
- generated `fesm2022/`
- generated `types/`

Example:

```bash
bash ./scripts/verify-dist-package.sh ./dist/ofoqh-ux
```

## Recommended flows

Build UX only:

```bash
cd /home/jnabizada/Projects/Ofoqh/ofoqh.shared
bash ./scripts/build-ux.sh
```

Publish only UX:

```bash
cd /home/jnabizada/Projects/Ofoqh/ofoqh.shared
bash ./scripts/publish-verdaccio.sh ux
```

Publish only workflow diagnostics to BaGetter:

```bash
cd /home/jnabizada/Projects/Ofoqh/ofoqh.shared
bash ./scripts/publish-bagetter.sh workflow-diagnostics
```

Remove a bad UX npm version:

```bash
cd /home/jnabizada/Projects/Ofoqh/ofoqh.shared
bash ./scripts/unpublish-verdaccio.sh ux@0.0.9
```
