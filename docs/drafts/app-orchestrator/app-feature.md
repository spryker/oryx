# AppFeature

`AppFeature` is a higher level collection of lower level primitives such as:

- Components
- Providers
- AppPlugins
- Resources
- Feature options

To register `AppFeature` with Oryx application use `withFeature` API:

```ts
import { appBuilder, AppFeature } from '@spryker-oryx/core';

const myFeature: AppFeature = {...};

const app = appBuilder().withFeature(myFeature);
```

`AppFeature` is represented as an interface and you may create them
as simple variables or as classes when you need to pass configuration in:

```ts
import { AppFeature } from '@spryker-oryx/core';

const mySimpleFeature: AppFeature = {
  components: [...],
  providers: [...],
}

// or

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
