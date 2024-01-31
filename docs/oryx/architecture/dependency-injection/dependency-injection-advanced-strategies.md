---
title: "Dependency Injection: Advanced strategies"
description: Strategies for using DI that cover advanced use cases
template: concept-topic-template
last_updated: Apr 13, 2023
redirect_from:
  - /docs/scos/dev/front-end-development/202311.0/oryx/dependency-injection/dependency-injection-advanced-strategies.html
---


This document describes advanced strategies of using [dependency injection (DI)](/docs/oryx/architecture/dependency-injection/dependency-injection.md).


## The INJECTOR token

In some cases, dependencies may be optional or resolved at runtime, making it difficult to inject them directly into a service. In such cases, you can inject the current DI container using the `INJECTOR` token. Example:

```ts
constructor(protected injector = inject(INJECTOR)) {}
```

With the `INJECTOR` token injected, you can use the `INJECTOR`'s `inject` method to dynamically resolve dependencies at runtime. Example:

```ts
someServiceMethod(field) {
	const template = this.injector.inject(`${FormFieldRenderer}-${field.type}`);
}

```

In this example, the `inject` method is used to resolve a dependency based on a dynamic token that includes the `field` type. Because the `field` type is only known at runtime, it's impossible to inject the dependency directly. Instead, the `INJECTOR` token is injected, allowing the `inject` method to resolve the dependency dynamically.

## Multi-providers

Most dependencies in an application correspond to only one value, like a class. In some cases, it is useful to have dependencies with multiple values, like HTTP interceptors or normalizers. However, it's not very practical to configure these dependencies separately, because the application needs to access them all together at once. Therefore, you can use a special type of dependency that accepts multiple values and is linked to the same dependency injection token. These are called multi-providers.

There are different types of multi-providers based on location an number of asterisks(`*`) in  the name of their tokens. They are described in the following sections.

### Providers with an asterisk in the end of token name

These providers define multi-providers with an array of elements. The name of their token looks like `[token-base-name]*`.

```ts
[
  { provider: 'multi*', useValue: 'a' },
  { provider: 'multi*', useValue: 'b' },
  { provider: 'multi*', useValue: 'c' },
];
///
inject('multi*'); // [a,b,c];
```

### Providers with an asterisk in the middle of token name

Based on token name, these providers define the following:

- `[token-base-name]*[token-specifier-name]`: a single provider.
- `[token-base-name]*`: multi-providers with an array of elements.

```ts
[
  { provider: 'multi*a', useValue: 'a' },
  { provider: 'multi*b', useValue: 'b' },
  { provider: 'multi*c', useValue: 'c' },
];
///
inject('multi*a'); // a;
inject('multi*'); // [a,b,c];
```

### Providers with two and more asterisks in token name

Based on token name, these providers define the following:

- `[token-base-name]*[sub-token-name]*[token-specifier-name]`: a single provider.
- `[token-base-name]*`: multi-providers with an array of elements.
- `[token-base-name]*[sub-token-name]*`: multi-providers with an array of elements.

```ts
[
  { provider: 'multi*a', useValue: 'a' },
  { provider: 'multi*b', useValue: 'b' },
  { provider: 'multi*new*c', useValue: 'c' },
  { provider: 'multi*new*d', useValue: 'd' },
];
///
inject('multi*a'); // a;
inject('multi*new*c'); // c;
inject('multi*'); // [a,b,c,d];
inject('multi*new*'); // [c,d];
```

You can also combine multiple providers by defining a provider with the `[token-base-name]*[token-specifier-name]` token and adding another one with the `[token-base-name]*` token.

```ts
[
  { provider: 'multi*a', useValue: 'a' },
  { provider: 'multi*', useValue: 'b' },
];
///
inject('multi*a'); // a;
inject('multi*'); // [a,b];
```

In summary, providers with different asterisk patterns in their token names offer various ways to define single and multi-providers. These patterns allow for more flexibility and organization when managing dependencies in an application.
