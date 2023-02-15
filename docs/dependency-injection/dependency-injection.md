# 1. What is Dependency Injection (DI)?

Dependency injection (DI) is a design pattern that provide loosely-coupled, maintainable, and testable code. It improves modularity, maintainability, and testability, and is easily customizable and extensible.

# 2. Service layer in Oryx

In Oryx, dependency injection (DI) serves as the foundation for the business logic. By using DI to provide service layer, Oryx is designed to be easily customizable and extensible on every level, making it an ideal choice for projects with complex or rapidly-evolving requirements.

The goal of service layer in Oryx is to  abstracts all of the system functionality,  including query backend services,  data caching and reloading, state management, and reactivity.

DI is also utilized by many higher-level concepts in Oryx, ranging from adapters, normalizers,  HTTP interceptors, to authentication, product loading, cart management, and checkout process.

## @spryker-oryx/di package

The @spryker-oryx/di library provides dependency injection to Oryx applications, including a variety of useful utilities to streamline working with the DI. This includes:

- TypeScript models definitions (e.g. Providers)
-  `Injector` - the mplementation of a DI container in TypeScript
-  Functions used to set up and manage injectors (`createInjector()`, `getInjector()`, etc.)
-   Utilities that can be used to resolve dependencies (`inject` and `resolve`)

In a typical Oryx application, much of the work related to setting up the DI container is handled automatically by the application orchestrator. However, the @spryker-oryx/di library provides a  set of tools that can be used to further customize and fine-tune the DI as needed.

# 3. Using services

## inject vs resolve

there are two primary methods for injecting services and dependencies into components: `inject` and `resolve`.

### inject()

The `inject` method is used to inject services from the current injector. This method can be used when the injection context is defined, such as in services at construction time or in provided factories that use `useFactory`.

For example, consider the following code:

```typescript
export class MyService { 
   constructor(protected otherService = inject(SomeOtherService)) {} 
}
```

In this example, the `MyService` constructor injects an instance of `SomeOtherService` using the `inject()` utility.

### resolve()

The `resolve` method works similarly to `inject`, but it tries to resolve the current injector using context (by default globalThis). This method is suitable to use in components, especially in web components, where the injection context may not be defined at construction time.

For example, consider the following code:

```typescript
export class MyComponent extends LitElement { 
   portected myService = resolve(MyService); 
}
```

In this example, the `MyComponent` class uses the `resolve` utility to inject an instance of `MyService` into the component. Since `MyComponent` does not have an explicit injector defined at construction time, `resolve` uses the global context to resolve the injector.


## Injecting INJECTOR


In some cases, dependencies may be optional or resolved at runtime, making it difficult to inject them directly into a service. In these situations, you can inject the current DI container using the `INJECTOR` token, like in the following example:


```typescript
constructor(protected injector = inject(INJECTOR)) {}
```


With the `INJECTOR` token injected, you can use the injector's `inject` method to dynamically resolve dependencies at runtime. For example:

```typescript
someServiceMethod(field) {
	const template = this.injector.inject(`${FormFieldRenderer}-${field.type}`);
}

```

In this example, the `inject` method is used to resolve a dependency based on a dynamic token that includes the field type. Since the field type is only known at runtime, it is not possible to inject the dependency directly. Instead, the `INJECTOR` token is injected, allowing the `inject` method to resolve the dependency dynamically.


# 4. Defining services

In Oryx, we follow certain conventions for defining services.

## String-Based Token

Services are resolved using string tokens. For example:

```typescript
export const CartService = 'FES.CartService';
```


## Service Interface

The service interface is a plain TypeScript interface that describes the public API of the service. Here's an example:

```typescript
export interface CartService {   
  load(): Observable<null>;
  getCart(data?: CartQualifier): Observable<Cart | null>; 
}
```

Since TypeScript interfaces are lightweight, there's no overhead or tight coupling between the service definition (and its token) and its implementation.

## ## Coupling Token with Interface

To achieve type safety and couple the string token with a specific interface, we use a technique to augment the global `InjectionTokensContractMap`:

```typescript
declare global {
  interface InjectionTokensContractMap {
  [CartService]: CartService;   
  } 
}
```

Thanks to this, both `resolve` and `inject` are able to infer the proper type when injecting a service using a string token, providing type-safety for your code.

## Default Implementation

The default implementation is usually a class that implements the service interface. Here's an example:

```typescript
export class DefaultCartService implements CartService { 
// implementation 
}
```



# # 5. Providing services

To be able to use and inject services, they must be provided in the DI container. Oryx provides several types of providers:

-   `ClassProvider<T>`: Binds a token to a class constructor.
-   `ValueProvider<T>`: Binds a token to a value.
-   `FactoryProvider<T>`: Binds a token to a factory function.

You can pass a list of providers as an argument to the `Injector` constructor or to the `Injector`'s `provide` method. However, it's important to note that providing services is only possible before the first usage of the DI container.

In Oryx applications, providers are usually grouped into const arrays and passed to the app orchestrator either directly or as a part of feature definitions. By doing this, you can easily manage features with corresponding providers and their dependencies.



# 6. Multi Providers

While most dependencies in an app correspond to only one value, such as a class, there are situations where we want to have dependencies with multiple different values, for example HTTP interceptors or normalizers. However, it's not very practical to configure all these dependencies separately, because we want to access them all together at once. Therefore, we can use a special type of dependency that accepts multiple values, not just one, linked to the exact same dependency injection token. These are called multi-providers.

## Providing

Providers which token naming is ended with asterisk (`*`) `[token-base-name]*`:

- creates multi providers with array of elements.

```ts  
[  
  {    provider: 'multi*',    useValue: 'a',  },  {    provider: 'multi*',    useValue: 'b',  },  {    provider: 'multi*',    useValue: 'c',  },];  
///  
inject('multi*'); // [a,b,c];  
```  

Providers which token naming is included with asterisk (`*`) `[token-base-name]*[token-specifier-name]`:

- creates single provider by token `[token-base-name]*[token-specifier-name]`.
- creates multi providers with array of elements by token `[token-base-name]*`.

```ts  
[  
  {    provider: 'multi*a',    useValue: 'a',  },  {    provider: 'multi*b',    useValue: 'b',  },  {    provider: 'multi*c',    useValue: 'c',  },];  
///  
inject('multi*a'); // a;  
inject('multi*b'); // b;  
inject('multi*c'); // c;  
inject('multi*'); // [a,b,c];  
```  

Providers which token naming is included with asterisk (`*`) twice (or more) `[token-base-name]*[sub-token-name]*[token-specifier-name]`:

- creates single provider by token `[token-base-name]*[sub-token-name]*[token-specifier-name]`.
- creates multi providers with array of elements by token `[token-base-name]*`.
- creates multi providers with array of elements by token `[token-base-name]*[sub-token-name]*`.

```ts  
[  
  {    provider: 'multi*a',    useValue: 'a',  },  {    provider: 'multi*b',    useValue: 'b',  },  {    provider: 'multi*new*c',    useValue: 'c',  },  {    provider: 'multi*new*d',    useValue: 'd',  },];  
///  
inject('multi*a'); // a;  
inject('multi*b'); // b;  
inject('multi*new*c'); // c;  
inject('multi*new*d'); // d;  
inject('multi*'); // [a,b,c,d];  
inject('multi*new*'); // [c,d];  
```  

It is possible to merge multiple providers in case if provider was created by `[token-base-name]*[token-specifier-name]` token and another one added by `[token-base-name]*` token.

```ts  
[  
  {    provider: 'multi*a',    useValue: 'a',  },  {    provider: 'multi*',    useValue: 'b',  },];  
///  
inject('multi*a'); // a;  
inject('multi*'); // [a,b];  
```
