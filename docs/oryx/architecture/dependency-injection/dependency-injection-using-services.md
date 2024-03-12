---
title: 'Dependency Injection: Using services'
description: Learn how to inject services and dependencies
template: concept-topic-template
last_updated: Apr 13, 2023
redirect_from:
  - /docs/scos/dev/front-end-development/202311.0/oryx/dependency-injection/dependency-injection-using-services.html
---

There are two primary methods for injecting services and dependencies:

- `inject`: usually used inside services.
- `resolve`: usually used inside components and web components.

## inject()

The `inject` method is used to inject services from the current injector. This method can be used when the injection context is defined, such as in services' constructors or in provided factories that use `useFactory`.

```ts
export class MyService {
  constructor(protected otherService = inject(SomeOtherService)) {}
}
```

## resolve()

The `resolve` method works similarly to `inject`, but it tries to resolve the current injector using context. By default, it tries to resolve `globalThis`. This method is suitable to use in components, especially in web components, where the injection context may not be defined in services' constructors.

```ts
export class MyComponent extends LitElement {
  protected myService = resolve(MyService);
}
```

## One container by default

A typical Oryx application usually uses one global DI container, which is set up by the app orchestrator. This is the recommended approach for Oryx applications that utilize web components, as it provides a streamlined solution that usually addresses all requirements of an application.

## Next steps

[Defining services](/docs/oryx/architecture/dependency-injection/dependency-injection-defining-services.md)
