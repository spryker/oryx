---
title: Oryx application feature
description: Feature of the Oryx Application
template: concept-topic-template
redirect_from:
  - /docs/scos/dev/front-end-development/202311.0/oryx/oryx-application-orchestration/oryx-application-feature.html
---


`AppFeature` is a higher level collection of lower-level primitives, such as the following:

<!-- TODO: Link to components -->
- Components
<!-- TODO: Link to providers -->
- Providers
- [Plugins](/docs/oryx/building-applications/oryx-application-orchestration/oryx-application-plugins.md)
<!-- TODO: Link to resources -->
- Resources
- [Feature options](#feature-options)
- [Builder options](/docs/oryx/building-applications/oryx-application-orchestration/oryx-application-orchestration.html#customization-of-options)

Features are useful to structure and organize code and functionality into logical groups and to make them easier to reuse in different scenarios.

Every Oryx package exposes such features for an easy integration in your application.

To register `AppFeature` in an Oryx application, use the `appBuilder.withFeature()` API:

```ts
import { appBuilder, AppFeature } from '@spryker-oryx/core';

const myFeature: AppFeature = {...};

const app = appBuilder().withFeature(myFeature);
```

`AppFeature` is represented as an interface, and you can create interfaces as simple object literals:

```ts
import { AppFeature } from '@spryker-oryx/core';

const mySimpleFeature: AppFeature = {
  components: [...],
  providers: [...],
}
```

When you want them to be configurable and more flexible, create them as classes or functions:

```ts
class MyConfigurableFeature implements AppFeature {
  components;
  providers;

  constructor(config: MyConfigurableFeatureConfig) {
    // Use `config` to customize your feature here
    this.components = [...];
    this.providers = [...];
  }
}
```

## Extend features

Depending on how a feature is defined, you can extend it as follows.

For features defined as object literals, you can use spread operators to customize some parts of it:

```ts
const myExtendedFeature = {
  ...mySimpleFeature,
  components: [
    ...mySimpleFeature.components,
    ...[
      /* Custom components here */
    ],
  ],
};
```

For features defined as classes or functions, to be able to accept the configuration and pass it to the original feature, you also have to use a class or function:

```ts
class MyExtendedFeature extends MyConfigurableFeature {
  constructor(config: MyConfigurableFeatureConfig) {
    super(config);
    this.components = [
      ...this.components,
      ...[
        /* Custom components here */
      ],
    ];
  }
}
```

## Feature options

If you want the feature to accept options when it's going to be integrated, you can use the `FeatureOptionsService.getFeatureOptions()` API:

```ts
import { FeatureOptionsService } from '@spryker-oryx/core';

class MyService {
  constructor(private featureOptionsService = inject(FeatureOptionsService)) {
    const options = FeatureOptionsService.getFeatureOptions('your-feature-key');
    // Use your options here
  }
}
```

This lets the developer who's integrating the feature to pass options via `appBuilder.withOptions()`, and it's going to be fully typed and typesafe:

```ts
import { appBuilder } from '@spryker-oryx/core';

appBuilder().withOptions({'your-feature-key': {...}});
```

### Define default values for feature options

To avoid forcing users to repeatedly pass the same kind of values, you can provide default values for your feature options. After you define `AppFeature.defaultOptions` for a feature, it is used when a user does not provide any option:

```ts
import { AppFeature } from '@spryker-oryx/core';

const yourFeature: AppFeature = {
  defaultOptions: {...} // <-- Put your default options here
}
```
