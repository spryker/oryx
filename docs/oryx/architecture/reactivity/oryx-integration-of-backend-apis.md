---
title: "Oryx: Integration of backend APIs"
description: Compose a frontend application from backend APIs
template: concept-topic-template
last_updated: Apr 3, 2023
redirect_from:
  - /docs/scos/dev/front-end-development/202311.0/oryx/reactivity/oryx-integration-of-backend-apis.html
---


To compose a frontend application from different backend APIs, Oryx provides a flexible architecture. This architecture lets you adapt third-party APIs without changing business logic and components. For example, when an alternative search system is used, the existing application layers and components can remain unchanged.

## Data models

In modern web applications, it is common to communicate with an API to retrieve data. However, the response from an API can be complex and not suitable to be directly used in a component. This is where client models come into play. A _client model_ is a representation of data that is tailored specifically for the needs of a client-side application.

In the Oryx framework, adapters transform API responses into a client model. Adapters make HTTP requests to load data from APIs and provide normalizers or serializers to transform the data into a more readable format. This is especially important when working with complex data standards like JSON-API, as they can be difficult for a component to work with directly.

By transforming the data from an API into a client model, adapters abstract away the complexities of the API responses and provide a simplified, more accessible representation of the data to the components in the application. This lets you create components that are easy to maintain and understand, while still being able to take advantage of the underlying data provided by the API.

The following is a sequence diagram of this high-level architecture:

{% include diagrams/oryx/backend-integration.md %}

The following steps are visualized:

1. Service requests data from Adapter.
2. Adapter sends an API call to the API.
3. API returns a response to Adapter.
4. Adapter loops through all normalizers, passing the response through each one.
5. Normalizers normalize the response.
6. Adapter receives the normalized response from Normalizer and returns it to Service.

To make the transformation from API models to client models extensible, Oryx uses a _multi-provider_ injection token for normalizers. This lets third-party packages and custom implementations to provide their own normalizers and seamlessly integrate with the existing architecture.

{% info_block infoBox "Note" %}

While a decoupled data model provides a more flexible architecture and is recommended in the Oryx framework, it does not mean that customizations or third-party integrations need to follow this practice. In some cases, you may want to skip the normalization and over-engineer the architecture for an individual extension.

{% endinfo_block %}

## Qualification of requests

Components, services, and adapters are customizable. To ensure that a change in a request can be introduced and applied in any layer, without customizing all layers, we recommend using a so-called qualifier in the application flow. A qualifier is a single object that is passed through the application and can be defined and redefined globally. The following example shows the use of `ProductQualifier` in `ProductService`.

```ts
export interface ProductQualifier {
  sku?: string;
  include?: string[];
}

export class DefaultProductService implements ProductService {
  get(qualifier: ProductQualifier): Observable<NullableGeneric<Product>> {
    return this.getProductData(qualifier).value;
  }
}
```

Whenever the request requires a new property—for example, to query the product for a certain brand or supplier, you can extend the qualifier:

```ts
declare global {
  interface ProductQualifier {
    brand?: string;
  }
}
```

This change is transparent to all application layers and can be picked up by the Adapter layer to use the `brand` field to fetch products by brand.
