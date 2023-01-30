# Routing

Routing is an essential feature for any web application, allowing users to navigate between
different pages or components within the application. The `@spryker-oryx/router` package
provides routing infrastructure for your application, including a `RouterService`
for interacting with the router and framework-specific integrations for providing
actual routing config. This guide will walk you through the process of setting up routing
in your application, including how to add the `RouterFeature` to your application,
render the router outlet, and provide routes using Dependency Injection (DI).

`@spryker-oryx/router` provides infrastructure for routing capabilities.
It gives you mainly the [`RouterService`](/libs/platform/router/src/services/router.service.ts)
which is a generic way for navigating in your application.

There are also framework specific integrations for providing actual routing config:

- for Lit use `@spryker-oryx/router/lit` package

## Getting started

To start using router add `RouterFeature` to your application:

```ts
import { appBuilder } from '@spryker-oryx/core';
import { RouterFeature } from '@spryker-oryx/router';

appBuilder().withFeature(new RouterFeature());
```

Now you can use `RouterService` in your components and services to interact with the router.

## Lit routing

To render router outlet you should add `LitRouter` to your root app component
and render it's outlet:

```ts
import { LitElement } from 'lit';
import { LitRouter } from '@spryker-oryx/router/lit';

class RootComponent extends LitElement {
  router = new LitRouter(this, []); // <-- You may provide some static routes here

  protected override render() {
    return this.router.outlet();
  }
}
```

Then you can provide routes for Lit applications using DI:

```ts
import { appBuilder } from '@spryker-oryx/core';
import { provideLitRoutes } from '@spryker-oryx/router/lit';

const routes = [{ path: '/', render: () => html`<my-page></my-page>` }];

appBuilder().withProviders(provideLitRoutes({ routes }));
```

Please note that this is a basic example and you may need to adjust the routing config
to fit your specific use case. Additionally, you may want to consider adding more
detailed explanations and examples throughout this documentation to help users
understand and implement routing in their application.
