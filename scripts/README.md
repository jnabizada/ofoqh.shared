# Scripts

Helper scripts in this folder are the supported way to build and publish shared
packages from `ofoqh.shared`.

Use these registries only:

- BaGetter: `https://bagetter.dev-test.careerpath.ofoqh.com/v3/index.json`
- Verdaccio: `https://verdaccio.dev-test.careerpath.ofoqh.com/`

## Files

### `build-verdaccio.sh`

Builds the npm shared packages supported by the Verdaccio publish flow.

Default behavior:

- builds all supported npm packages:
  - `workflow-diagnostics`
  - `angular-tenant`
  - `ux`

Selective behavior:

```bash
bash ./scripts/build-verdaccio.sh workflow-diagnostics
bash ./scripts/build-verdaccio.sh angular-tenant
bash ./scripts/build-verdaccio.sh ux
bash ./scripts/build-verdaccio.sh workflow-diagnostics ux
```

Notes:

- `all` is the default when no target is passed.
- this script mirrors the target model used by `publish-verdaccio.sh`.
- output directories include:
  - `./dist/angular-tenant`
  - `./dist/ofoqh-ux`
  - workspace build output for `workflow-diagnostics`

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

Build all npm shared packages:

```bash
cd /home/jnabizada/Projects/Ofoqh/ofoqh.shared
bash ./scripts/build-verdaccio.sh
```

Build only UX:

```bash
cd /home/jnabizada/Projects/Ofoqh/ofoqh.shared
bash ./scripts/build-verdaccio.sh ux
```

Build only angular tenant:

```bash
cd /home/jnabizada/Projects/Ofoqh/ofoqh.shared
bash ./scripts/build-verdaccio.sh angular-tenant
```

Build only workflow diagnostics:

```bash
cd /home/jnabizada/Projects/Ofoqh/ofoqh.shared
bash ./scripts/build-verdaccio.sh workflow-diagnostics
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
