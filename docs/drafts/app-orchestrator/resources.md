# Resources

`Resources` represent a generic way of lazy loading graphics into Oryx application at runtime.
It is usually used to load things like images, icons, fonts, etc.

Declare your resources using a variable which should resolve to a string:

```ts
import { Resources } from '@spryker-oryx/core';

const myResources: Resources = {
  graphics: {
    logo: { source: () => import('./my-logo').then((m) => m.default) },
    'other-img': {
      source: () => import('./my-other-img').then((m) => m.default),
    },
  },
};
```

Then register `Resources` with Oryx application use `withResources` API:

```ts
import { appBuilder } from '@spryker-oryx/core';

const app = appBuilder().withResources(myResources);
```
