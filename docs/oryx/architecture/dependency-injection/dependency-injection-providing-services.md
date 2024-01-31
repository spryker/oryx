---
title: "Dependency Injection: Providing services"
description: Recommended conventions for providing services
template: concept-topic-template
last_updated: Apr 13, 2023
redirect_from:
  - /docs/scos/dev/front-end-development/202311.0/oryx/dependency-injection/dependency-injection-providing-services.html
---

To use and inject services, they must be provided in the DI container. Oryx offers several types of providers:

- `ClassProvider<T>`: binds a token to a class constructor.
- `ValueProvider<T>`: binds a token to a value.
- `FactoryProvider<T>`: binds a token to a factory function.
- `ExistingProvider<T>`: binds a token to an existing token.
- `AsyncClassProvider<T>`: binds a token to a asynchronously resolved class constructor.


You can pass a list of providers as an argument to the `Injector` constructor or to the Injector's `provide` method.

{% info_block warningBox "When to provide services" %}

Providing services is only possible before the first usage of the DI container.

{% endinfo_block %}

In Oryx applications, providers are typically grouped into const arrays and passed to the app orchestrator either directly or as part of feature definitions. By doing this, you can easily manage features with corresponding providers and their dependencies.

Here's an example describing how to use the app orchestrator to provide services as part of a feature:

```ts
export const app = appBuilder()
  // ...
  .withFeature({
    providers: [{ provide: CartService, useClass: CustomizedCartService }],
  })
  // ...
  .create();
```

In this example, the customized cart service is provided by specifying the provider's property within a feature object. This way, you can easily manage and extend the services provided by your Oryx application.

## Next steps

[Advanced strategies](/docs/oryx/architecture/dependency-injection/dependency-injection-advanced-strategies.md)
