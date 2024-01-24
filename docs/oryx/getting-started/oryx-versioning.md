---
title: "Oryx: Versioning"
description: Oryx framework uses semantic versioning to ensure stability
template: concept-topic-template
last_updated: Mar 3, 2023
redirect_from:
  - /docs/scos/dev/front-end-development/202311.0/oryx/oryx-versioning.html
---

This document describes the methods used in Oryx to deliver an advanced application development platform while maintaining stability. The goal of implementing versioning methods is to ensure that changes are introduced in a predictable manner. This makes sure that all Oryx users are informed and adequately prepared for the release and removal of features.

The following sections describe how the Oryx framework achieves versioning and release stability, uses version numbers to indicate changes, and ensures backward compatibility.

## Semantic versioning

Oryx follows the principles of [semantic versioning](https://semver.org/). This means that, for version `x.y.z`, the following applies:
- If critical bug fixes are released, a patch release is made by changing the `z` number. For example, `1.5.2` to `1.5.3`.
- If new features or non-critical fixes are released, a minor release is made by changing the `y` number. For example, `1.5.2` to `15.6.0`.
- If significant changes that may break compatibility are released, a major release is made by changing the `x` number. For example, `1.5.2` to `2.0.0`.

### Release previews

For every major and minor release, we offer prerelease versions called Release Candidates (RC).

## Release process

The Oryx framework consists of two components that are released separately:
- Libraries
- Labs

### Libraries

The primary source of functionality within the framework is the Oryx libraries. They include core features, utilities and helpers, domain-specific functionality, as well as predesigned themes and presets that can be used as provided by default.

The libraries are released as [packages](https://www.npmjs.com/org/spryker-oryx) under the same version.

### Labs

The Oryx labs consist of experimental or demo functionality. Its version is tied to the current version of the libraries and is never considered stable. Therefore, the labs version number consists of three parts:

```
0.{libraries-version}.{patch}
```

For example, if the current libraries version is `1.5.2`, the version of the labs is `0.152.0`. If we release the next version of labs before releasing the libraries, the version of the labs is updated to `0.152.1`.

## Upgrading Oryx

To perform a minor or patch update of the Oryx framework, you need to update every Oryx-related package you are using to the latest version of the same major version. For example, if you want to update Oryx from version `1.2` to `1.3`, you should update all Oryx-related packages to version `1.3` using a command similar to the following:
```
npm i @spryker-oryx/{package-name}@1.3
```

Specific package names and versions may vary depending on your project and its dependencies. For the correct package names and versions, check the documentation or release notes of the specific Oryx version you are upgrading to.

A major upgrade may require significant code changes that may be incompatible with previous versions of Oryx. To perform a major upgrade of the Oryx framework, refer to a respective migration or upgrade guide provided in the documentation.

<!--

## Public API

Oryx consists of a range of packages, applications, and tools. To avoid inadvertent use of private APIs and get a clear understanding of what's included or excluded from the private API, see public API](//TODO: add link)-->.

## Backward compatibility

The Oryx framework provides maximum compatibility with previous versions. If a feature is deprecated, it is removed completely only after a few releases.

Minor releases are fully backward compatible and do not require any developer assistance.

### Deprecation practices

If a newer and better alternative to a feature is introduced in a minor release, the old one is deprecated. Deprecated features remain functional until the next major release, in which they are removed completely.

## Feature flag versioning

Feature flag versioning enables you to roll out new functionalities, like changes in page structure or additional component options, while ensuring backward compatibility. Feature flag versioning is directly aligned with major and minor releases, allowing for a balanced mix of innovation and stability.

### ORYX_FEATURE_VERSION

The `ORYX_FEATURE_VERSION` environment variable is used to opt into new functionalities or to lock and maintain compatibility with existing setups. It optimizes your build by leveraging Dead Code Elimination. Any code unrelated to the defined version isn't included in the final bundle, making your application leaner.

The following example shows how you can define a specific version:

```
ORYX_FEATURE_VERSION=1.1
```

You can also use the `featureVersion` utility in your code or third-party libraries to conditionally enable features.

```typescript
import { featureVersion } from '@spryker-oryx/utilities';
if (featureVersion >= '1.1') { /* New feature code */ }
```
