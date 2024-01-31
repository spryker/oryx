---
title: Building Services with Oryx
description: This tutorial will guide you through the process of building services with the Oryx framework. We'll leverage Oryx's dependency injection (DI) mechanism, HttpService and Query.
---

## Introduction

Oryx is a robust framework that offers a suite of tools for building modern web applications. One of its key strengths lies in its implementation of dependency injection (DI). DI allows you to create modular, maintainable, and easily upgradable application logic. This tutorial specifically focuses on leveraging Oryx's DI system to build services, which can be later used in components.

## Creating the Service

### 1. Define the Service Token and Interface

Start by defining a string-based token for your service. Use customized prefix to minimize naming conflicts.

```ts
export const MyServiceToken = 'myCompany.MyService';
```

_All standard Oryx services uses `'oryx.'` as a token prefix._

Next, define the interface for the service, which outlines the service's public API:

```ts
export interface MyService {
  get(qualifier: DataQualifier): Observable<Data>;
  update(data: Data): Observable<Result>;
}
```

Note: it's recommended to either always return an `Observable` or `void` from service methods as then you can easily can make a service lazy-loaded.  

To couple the string token with the service interface and achieve type safety use `InjectionTokensContractMap` augmentation:

```ts
declare global {
  interface InjectionTokensContractMap {
    [MyServiceToken]: MyService;
  }
}
```

### 2. Implement the Service

Create a class that implements the service interface:

```ts
export class DefaultMyService implements MyService {
  get(qualifier: DataQualifier): Observable<Data> {
    // Implementation...
  }

  update(data: Data): Observable<Result> {
    // Implementation...
  }
}
```

We use `Default` prefix for default service implementation, but it's optional. When you are creating completely new service, you can use default also, if you are creating custom implementation for existing service, usually it's better to prefix it with a custom, more specific name.  

## Providing Service

To make services available for injection, you need to provide them in the Oryx DI container.

Use class provider, to binds a token to a class constructor and make sure your provider is passed to the DI container, either as part of a bigger feature, or directly to the app orchestrator:

```ts
export const app = appBuilder()
  // ...
  .withFeature({
    providers: [
      {
        provide: MyServiceToken,
        useClass: DefaultMyService
      }
    ]
  })
  // ...
  .create();
```

## Connecting the Backend

When creating services, often, you'll need to communicate with a backend server to fetch or send data. Direct HTTP requests are possible but not advised. Instead we recommend:
 
- using `adapters` as they provide both abstraction for separating services from the direct intricacies of API endpoints and consistency in data communication.
- using `HttpService` to make HTTP requests in `adapters`, as it provides a consistent way of making HTTP requests and handling responses, including interceptors. 
- using `Transfomers` (`Normalizers` and `Serializers`) to transform data from API models to client models in a generic, and customizable way.

Typical implementation from the service perspective could look like:

```ts
export class DefaultMyService implements MyService {

  constructor(protected adapter: MyAdapter) {}
    
  get(qualifier: DataQualifier): Observable<Data> {
      return this.adapter.get(qualifier);
  }

  update(data: Data): Observable<Result> {
    return this.adapter.update(data);
  }
}
```

For a deeper understanding role of adapters in Oryx's reactivity layers, refer to the [Integration of backend APIs](/docs/oryx/architecture/reactivity/oryx-integration-of-backend-apis.md).


## State Management with Queries

Efficient state management in services can be achieved by using Oryx Queries and Commands, which are mechanisms for maintaining and modifying application state.

In a service context, queries and commands work in tandem to handle the data flow seamlessly:

```ts
export class DefaultMyService implements MyService {

  constructor(private adapter: MyAdapter) {}
    
  protected query$ =  createQuery({
      loader: (qualifier: DataQualifier) => this.adapter.getAll(qualifier),
      refreshOn: [MyDataChanged],
  });

  protected command$ =  createQuery({
      action: (data: Data) => this.adapter.post(data),
      onSuccess: [MyDataChanged],
  });


  get(qualifier: DataQualifier): Observable<Data> {
      return this.query$.get(qualifier);
  }

  process(data: Data): Observable<Result> {
    return this.command$.execute(data);
  }
}
```

The minimal implementation involves encapsulating adapter interactions within queries and commands. As your application evolves, you can further utilize built-in features to manage aspects such as loading states, error handling, caching, and managing concurrent operations more efficiently.

For a deeper understanding role of adapters in Oryx's reactivity layers, refer to the Queries and Commands in Oryx.
