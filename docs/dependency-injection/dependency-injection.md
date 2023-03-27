# What is Dependency Injection (DI)?

Dependency injection (DI) is a design pattern that provides loosely-coupled, maintainable, and testable code. It improves modularity, maintainability, testability, and is easily customizable and extensible.

In the context of Oryx, dependency injection allows users to customize logic deep inside the framework, which is particularly useful for projects with complex or rapidly-evolving requirements. Without DI, users would need to override large portions of the logic or create a lot of boilerplate code. By leveraging DI, users can override logic while still being able to upgrade to newer versions of Oryx going forward.

One key advantage of using Oryx's DI implementation is that it is vanilla JavaScript and can be used in other frameworks as well. Although there are popular DI packages available, using Oryx's implementation ensures seamless integration and compatibility with its features.

# Service Layer in Oryx

The service layer in Oryx serves as the foundation for the business logic, with dependency injection (DI) playing a crucial role.

The main objective of the service layer in Oryx is to abstract all of the system functionality, including querying backend services, data caching and reloading, state management, and reactivity.

Furthermore, DI is utilized by many higher-level elements and concepts in Oryx, ranging from adapters and normalizers to HTTP interceptors, authentication, product loading, cart management, and the checkout process.

## Npm package

The `@spryker-oryx/di` package provides dependency injection not only to Oryx applications but also to other packages and can even be used outside the Oryx framework. It includes a variety of useful utilities to streamline working with dependency injection, such as:

- TypeScript models definitions (e.g. Providers)
- `Injector` - the implementation of a DI container in TypeScript
- Functions used to set up and manage injectors (`createInjector()`, `getInjector()`, etc.)
- Utilities that can be used to resolve dependencies (`inject` and `resolve`)

In a typical Oryx application, the application orchestrator automatically handles much of the work related to setting up the DI container. Nevertheless, the `@spryker-oryx/di` library provides a set of tools that can be used to further customize and fine-tune the dependency injection as needed.

# Using services

## inject vs resolve

There are two primary methods for injecting services and dependencies:

- `inject` – usually used inside services
- `resolve` – usually used inside (web) components

### inject()

```ts
export class MyService {
  constructor(protected otherService = inject(SomeOtherService)) {}
}
```

The `inject` method is used to inject services from the current injector. This method can be used when the injection context is defined, such as in services at construction time or in provided factories that use `useFactory`.

### resolve()

```ts
export class MyComponent extends LitElement {
  protected myService = resolve(MyService);
}
```

The `resolve` method works similarly to `inject`, but it tries to resolve the current injector using context (by default `globalThis`). This method is suitable to use in components, especially in web components, where the injection context may not be defined at construction time.

### One container by default

A typical Oryx application usually uses one global DI container, which is set up by the app orchestrator. This is currently the recommended approach for Oryx applications that utilize web components, as it provides a streamlined solution that typically addresses all requirements of the app.

# Defining services

In Oryx, we follow certain conventions for defining services.

## String-Based Token

Services are resolved using string tokens. For example:

```ts
export const CartService = 'oryx.CartService';
```

It is recommended to use a project-specific prefix for those tokens to minimize the risk of naming collisions with other services or libraries.

## Service Interface

The service interface is a plain TypeScript interface that describes the public API of the service. Here's an example:

```ts
export interface CartService {
  load(): Observable<null>;
  getCart(data?: CartQualifier): Observable<Cart | null>;
}
```

Since TypeScript interfaces are lightweight, there's no overhead or tight coupling between the service definition (and its token) and its implementation.

## Coupling Token with Interface

To achieve type safety and couple the string token with a specific interface, we use a technique to augment the global `InjectionTokensContractMap`:

```ts
declare global {
  interface InjectionTokensContractMap {
    [CartService]: CartService;
  }
}
```

Thanks to this, both `resolve` and `inject` are able to infer the proper type when injecting a service using a string token, providing type-safety for your code.

## Default Implementation

The default implementation is usually a class that implements the service interface. Here's an example:

```ts
export class DefaultCartService implements CartService {
  // implementation
}
```

# Providing services

To use and inject services, they must be provided in the DI container. Oryx offers several types of providers:

- `ClassProvider<T>`: Binds a token to a class constructor.
- `ValueProvider<T>`: Binds a token to a value.
- `FactoryProvider<T>`: Binds a token to a factory function.
- `ExistingProvider<T>`: Binds a token to an existing token.

You can pass a list of providers as an argument to the `Injector` constructor or to the Injector's `provide` method. However, it's important to note that providing services is only possible before the first usage of the DI container.

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

In this example, customized cart service is provided by specifying the providers property within a feature object. This way, you can easily manage and extend the services provided by your Oryx application.

# Injecting INJECTOR

In some cases, dependencies may be optional or resolved at runtime, making it difficult to inject them directly into a service. In these situations, you can inject the current DI container using the `INJECTOR` token, like in the following example:

```ts
constructor(protected injector = inject(INJECTOR)) {}
```

With the `INJECTOR` token injected, you can use the injector's `inject` method to dynamically resolve dependencies at runtime. For example:

```ts
someServiceMethod(field) {
	const template = this.injector.inject(`${FormFieldRenderer}-${field.type}`);
}

```

In this example, the `inject` method is used to resolve a dependency based on a dynamic token that includes the field type. Since the field type is only known at runtime, it is not possible to inject the dependency directly. Instead, the `INJECTOR` token is injected, allowing the `inject` method to resolve the dependency dynamically.

# Multi Providers

While most dependencies in an app correspond to only one value, such as a class, there are situations where we want to have dependencies with multiple different values, for example HTTP interceptors or normalizers. However, it's not very practical to configure all these dependencies separately, because we want to access them all together at once. Therefore, we can use a special type of dependency that accepts multiple values, not just one, linked to the exact same dependency injection token. These are called multi-providers.

## Providing

There are different types of providers based on their token naming with an asterisk (`*`):

### Providers with a single asterisk at the end of their token name (`[token-base-name]*`):

- These create multi-providers with an array of elements.

```ts
[
  { provider: 'multi*', useValue: 'a' },
  { provider: 'multi*', useValue: 'b' },
  { provider: 'multi*', useValue: 'c' },
];
///
inject('multi*'); // [a,b,c];
```

### Providers with an asterisk within their token name (`[token-base-name]*[token-specifier-name]`):

- These create a single provider for the token `[token-base-name]*[token-specifier-name]`.
- They also create multi-providers with an array of elements for the token `[token-base-name]*`.

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

### Providers with two (or more) asterisks in their token name (`[token-base-name]*[sub-token-name]*[token-specifier-name]`):

- These create a ingle provider for the token `[token-base-name]*[sub-token-name]*[token-specifier-name]`.
- They create multi-providers with an array of elements for the token `[token-base-name]*`.
- Additionally, they create multi-providers with an array of elements for the token `[token-base-name]*[sub-token-name]*`.

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

It is also possible to combine multiple providers if a provider is created with the token `[token-base-name]*[token-specifier-name]` and another one is added with the token `[token-base-name]*`.

```ts
[
  { provider: 'multi*a', useValue: 'a' },
  { provider: 'multi*', useValue: 'b' },
];
///
inject('multi*a'); // a;
inject('multi*'); // [a,b];
```

In summary, providers with different asterisk patterns in their token names offer various ways to create single and multi-providers. These patterns allow for more flexibility and organization when managing dependencies within an application.
