# Publishing

## Cluster Registries

This repository must publish to the shared cluster registries, not to local
developer-hosted registries.

Use:

- NuGet/BaGet: `https://bagetter.dev-test.careerpath.ofoqh.com/v3/index.json`
- npm/Verdaccio: `https://verdaccio.dev-test.careerpath.ofoqh.com/`

## NuGet Publish

```bash
bash ./scripts/publish-bagetter.sh
```

Environment variables:

- `BAGETTER_SOURCE_URL`
- `BAGETTER_API_KEY`

## npm Publish

```bash
bash ./scripts/publish-verdaccio.sh
```

Environment variables:

- `VERDACCIO_REGISTRY_URL`

## npm Unpublish

Remove an exact package version from Verdaccio:

```bash
bash ./scripts/unpublish-verdaccio.sh @ofoqh/workflow-diagnostics@0.1.1
```

You can also remove multiple exact versions in one run:

```bash
bash ./scripts/unpublish-verdaccio.sh \
  @ofoqh/angular-tenant@0.1.0 \
  @ofoqh/ux@0.1.0
```

Rules:

- Pass fully qualified `name@version` values only.
- Whole-package unpublish is intentionally blocked by the helper.
- The script uses `VERDACCIO_REGISTRY_URL` when provided.

## Important Rule

Consumer repositories such as `careerpath`, `communication`, and `idp` should
switch to package references only after these package versions are available in
the cluster registries.
