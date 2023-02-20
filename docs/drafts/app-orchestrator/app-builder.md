# AppBuilder

`AppBuilder` allows to compose different pieces into a single Oryx application.

It is a pluggable builder which supports the following built-ins:

- Options (`withAppOptions`/`withOptions`)
- AppFeatures (`withFeature`)
- Components (`withComponents`)
- Providers (`withProviders`)
- Themes (`withTheme`)
- Environment (`withEnvironment`)
- Resources (`withResources`)
- Plugins (`with`)

All of the above are built-in plugins but you can also
add your custom plugins by using `with` API:

```ts
import { appBuilder, AppPlugin } from '@spryker-oryx/core';

appBuilder().with(class MyPlugin implements AppPlugin {});
```

After all of the pieces have been registered you can create an app
by using `create` API which will return you a promise of the app:

```ts
import { appBuilder } from '@spryker-oryx/core';

const app = appBuilder().create().catch(console.error);
```

See [`App`](/docs/drafts/app-orchestrator/app.md) to learn more about it's usage.
