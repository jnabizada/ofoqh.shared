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

## Important Rule

Consumer repositories such as `careerpath`, `communication`, and `idp` should
switch to package references only after these package versions are available in
the cluster registries.
