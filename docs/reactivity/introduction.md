# An introduction to reactivity

## What is reactivity?

Reactivity is a fundamental concept in modern web development that enables dynamic, real-time updates to the user interface. In interactive applications, and single-page application (SPA) in particular, reactivity ensures that the display of data is constantly in sync with the underlying data model even as that data is loaded asynchronously and in real-time from a backend API.

In a reactive frontend, data is treated as _streams_ that continue to emit new values in an asynchronous manner. This allows for a highly responsive and engaging user experience, as updates to the data are immediately reflected in the user interface. Examples of reactive behavior include searching for products, adding to cart, navigating the application, and more.

This is achieved by establishing a connection between the user interface and the data model, so that changes to the data are automatically reflected in the user interface. Reactivity is widely used in modern frontend frameworks, but the the technical solution varies from framework to framework.

## Reactivity patterns in Oryx

Implementing reactivity in a web application is a complex challenge, especially in a single-page application where data is loaded asynchronously and in real-time from a backend API. Various components will (dynamically) request (the same) data and updates of the application state must be managed in a highly efficient way.

The following is a high-level overview of the reactivity patterns available in Oryx. In the diagram we illustrate this by the help of a product component.

```mermaid
sequenceDiagram
autonumber

ProductComponent-->AsyncStateController: @asyncState() product

note right of AsyncStateController: Observes updates of product
AsyncStateController-->AsyncStateController: observe
activate AsyncStateController
ProductComponent->>ProductService: get()
activate ProductService
ProductService-->>API: Requests/response data
ProductService-->>ProductComponent: returns data
deactivate ProductService
AsyncStateController->>AsyncStateController: indicates update
activate AsyncStateController
AsyncStateController-->>ProductComponent: requestUpdate()
activate ProductComponent
deactivate AsyncStateController
ProductComponent-->ProductComponent:update view
deactivate ProductComponent
deactivate AsyncStateController
```

**Note:** some of the standard architectural layers of Oryx have been omitted in this introduction diagram to keep the focus on the reactive concepts.

The following steps are identified in the diagram:

1. Components are not concerned with _how_ the component lifecycle is wired with the application state; new emissions of application state is automatically updated in the view.
2. Component state is controlled by a _reactive controller_ that knows the component lifecycle. This controller is specific to LIT, if you'd use another component framework you can leverage the services lower application layers, but you'd need to take care of the component lifecycle yourself.
3. Components delegate loading of data to a service. API integration is done in lower layers of the application logic (adapters, converters).
4. API responses are maintained in the service layer, to avoid duplicated requests (in parallel or sequence).
5. (new) emissions of the data is exposed to the component. Oryx has standardized on observables (using rxjs), so that the application can operate on streams in a flexible way.
6. The `AsyncStateController` observes (new) emission of the data stream.
7. The controller requests an update for the component.
8. The component re-renders the requested update (but not for other non-related parts of the application).
