# Release process.

## Regular release.

This is a regular flow, when you are just following our usual versioning and there no additional conditions.   

For a `next` release, run Release workflow from Github actions panel on `development` branch.
For a stable release, do the following:

1. Create branch from `development` for next minor/major as `release/v1.2.x`.
2. Update `libs/lerna.json` version to a new minor/major version as `1.2.0`.
3. Push the release branch.
4. Trigger Release workflow from Github actions panel on release branch.
   This creates an RC release.
5. On `development` branch update `libs/lerna.json` version to a next minor version as `1.3.0`

For a stable release on a release branch, do the following:

1. Update `libs/lerna.json` version to remove RC tag `1.2.0-rc.4` -> `1.2.0`.
2. Push the version to the release branch.
3. Trigger Release workflow from Github actions panel on release branch.

For a patch on a release branch, do the following:

1. Push fixes to the release branch.
2. Trigger Release workflow from Github actions panel on release branch.

## Release from packages workflow.

This workflow should be used in case regular workflow 

1. Create branch from `development` for next minor/major as `release/v1.2.x`
2. Set the version of every package in `libs` manually (ex. `1.2.0`).
3. Update every `@spryker-oryx` `peerDependency` in every package in `libs` manually (ex. `1.2.0`).
4. Update `libs/lerna.json` version `1.2.0`.
5. Push the release branch.
6. Trigger Release from packages workflow from Github actions panel on release branch.

