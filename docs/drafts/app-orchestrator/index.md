# App orchestrator

Any Oryx application starts with the orchestrator.
It allows to compose your application from reusable bits and pieces such as
features, components, providers, themes, etc.

To use app orchestrator import `AppBuilder` from the `@spryker-oryx/core` and
start composing your own set of features with it:

```ts
import { appBuilder } from '@spryker-oryx/core';
import { b2cFeatures, b2cTheme } from '@spryker-oryx/presets';

const app = appBuilder()
  .withFeature(b2cFeatures)
  .withTheme(b2cTheme)
  .withEnvironment(import.meta.env);
```

Once you are satisfied with your app configuration it's time to create it:

```ts
app.create().catch(console.error);
```

Now you have fully up and running Oryx app tailored to your needs!

---

To learn more about details of app orchestrator see:

- [AppBuilder](/docs/drafts/app-orchestrator/app-builder.md)
- [App](/docs/drafts/app-orchestrator/app.md)
- [AppFeature](/docs/drafts/app-orchestrator/app-feature.md)
- [AppEnvironment](/docs/drafts/app-orchestrator/app-environment.md)
- [Components](/docs/drafts/components/index.md)
- [Providers](TODO: Link to providers)
- [Resources](/docs/drafts/app-orchestrator/resources.md)
- [Theme](/docs/drafts/theme/configuration.md)
