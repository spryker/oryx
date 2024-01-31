---
title: Key concepts of Reactivity
description: Understanding Reactivity concepts will help you understand how Oryx works
template: concept-topic-template
last_updated: Apr 3, 2023
redirect_from:
  - /docs/scos/dev/front-end-development/202311.0/oryx/reactivity/key-concepts-of-reactivity.html
---



## Reactive data streams

Reactive data streams are a fundamental concept in Oryx. They play a crucial role in managing and manipulating data in real time. Oryx prefers [Observables](https://rxjs.dev/guide/observable) over [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) as they are more powerful and allow for continuous streams of data over time. This is particularly helpful in experiences that remain active for some time-for example, in a Single Page Application (SPA).

An observable can emit different values over time. In Oryx, components are bound to data observed from APIs and stored in the [application state](#application-state). Whenever application state is updated, a new value is emitted, and the component updates its view automatically in an efficient manner.

Oryx makes use of reactive programming through the popular library [RxJS](https://rxjs.dev/). It provides a set of tools and techniques to make it easier to work with asynchronous data streams and event-driven systems. RxJS is a platform agnostic library that provides the following:

- An Observable primitive that can be used as a base mechanism for reactivity with support or bridges into different frameworks.
- Ability to emit more than one value.
- Ability to resolve value both asynchronously and synchronously.
- Ability to utilize tried and tested operators to combine streams and define reactive logic.

## Application state

Application state is data that describes the _current_ state of an application at any given moment. It is used to render the user interface and provide the right behavior for user interactions.

Oryx does not provide a _global_ state management layer. Application state is maintained per _domain_, and each domain is only concerned with the associated data used by the domain. For example, product data is maintained in the product domain, and the product domain logic ensures that a product is only loaded once when multiple requests are being made for the same product.

Some part of the application state is maintained below domains. A good example is the internationalization state (or application context), like active language and currency. The internationalization domain is considered a core domain, so it can be used in other domains without introducing cycle dependencies in the system.

## Application layers

Oryx simplifies working with asynchronous application state and reactivity by handling the complexity under the hood while supporting customization. It provides vanilla JavaScript packages for services and lower-level layers, which can be reused by developers regardless of UI framework.

Most of the application state is driven by loading data from backend APIs. Oryx provides the following standardized application layers:

| LAYER      | PURPOSE                                                                                                                                                                                                                                                                                                                                  |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Component  | Renders application state inside UI elements.                                                                                                                                                                                                                                                                                            |
| Controller | Resolves application state for a given context, so that the component can be reused in different places. For example, a product title component can be used on the Product Details Page, product card, and in a cart entry. The controller resolves the product _sku_ from the context, so that the right product title can be resolved. |
| Service    | Manages the application state for a certain application domain.                                                                                                                                                                                                                                                                          |
| Adapter    | Loads the data from a specific backend API and convert it into the client model.                                                                                                                                                                                                                                                         |
| Http       | Wraps the native HTTP fetch and provides additional utilities to integrate HTTP headers like the authorization header.                                                                                                                                                                                                                   |

Some layers can be considered optional if you build your own domains or components. However, for Oryx, these layers are part of the recommended architecture. It increases separation of concerns and provides a clear and clean extension model. All application layers are customizable and allow for an alternative implementation.

The following diagram shows the interaction between layers using the product domain as an example.

{% include diagrams/oryx/reactivity-high-level.md %}

Description:

1. `ProductTitleComponent` is a web component that renders titles in the DOM. A title is typically an `<h1>` element, but this is configurable to make the component reusable in other contexts—for example, inside a cart entry component. The product title component relies on a controller to get the context and associated product data. The product title `name` is mapped from the product data.
2. `ProductController` uses finds out the relevant _context_ for the component and resolves the product qualifier (SKU) in order to make the right request. Whenever the product data is resolved, an update to the DOM is requested. This is actually done in `AsyncStateController`, which is left out on this diagram. The `ProductController` controller uses `ProductService` to resolve the product data.
   `ProductService` is a business service that controls the application state for the product. It makes sure that multiple requests for the same product do not result in multiple requests to the backend. `ProductService` delegates the actual loading of the data to `ProductAdapter`.
3. `ProductAdapter` integrates with the backend, by creating an HTTP request. The `ProductAdapter` knows the backend endpoint and it's contract so that it can create the right request. The `ProductAdapter` delegates actual HTTP requests to the `HttpService`.  
   When an alternative backend is integrated, the `ProductAdapter` can be replaced. The adapter converts the API data model to the client-side model in case of a mismatch. This is done by using normalizers. For details, see [Designing the data model](/docs/oryx/best-practice.html#designing-the-data-model.
4. `HttpService` is a small wrapper that is used to provide additional features such as support for interceptors.

## Updating data in the DOM

While observables and RxJS operators provide a great setup for an in-memory reactive system, it doesn't synchronize this to the UI automatically. Each JavaScript framework comes with its own concept and techniques for updating the UI. The method of choice contributes significantly to the performance and user experience of the application.

Oryx has a standardized library of web components and uses [Lit](https://lit.dev) to develop those components. Lit can update only the mutable parts of the components, and maintains the static parts unchanged. This results in a highly efficient rendering performance.

Oryx offers the `@asyncState` decorator for Lit components, which simplifies the use of reactive streams and reduces code complexity. However, if you are integrating Oryx into a different web framework, use the reactive patterns of that particular framework.

## Next steps

[Reactive components](/docs/oryx/architecture/reactivity/reactive-components.md)
