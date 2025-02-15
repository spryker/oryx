---
title: 'Oryx: Component types'
description: Oryx components compared to Atomic Design
last_updated: Sept 23, 2023
template: concept-topic-template
---

Oryx applications are built completely out of components. Whether it's a page or a section of the page or a button, they're all components.

Oryx supports three types of components:

- Design system components: highly reusable components that are used to build consistent user interfaces (UIs).
- Domain components: functional components that are concerned with a specific _domain_, like the product or cart domains.
- Composition components: containers that are used to render pages or sections by providing a list of components and their layout.

Even though Oryx does not implement [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/), the component types can be roughly mapped to the Atomic Design levels:

| Atomic Design level | Oryx Component           | Examples                       |
| ------------------- | ------------------------ | ------------------------------ |
| Atoms               | Design system components | Button, form element           |
| Molecules           | Domain components        | Product images, cart entry     |
| Organisms           | Compositions             | Product carousel, product list |
| Templates           | Composition references   | Header, footer                 |
| Pages               | Compositions             | Product page, Cart page        |

## Design system components

The Oryx design system offers a collection of highly reusable components that are essential for building a consistent and visually appealing UI. These components are agnostic of the application's context and serve as the building blocks for domain components.

Design system components ensure a consistent and cohesive visual language across the application. The components do not interact with application logic directly. Because they don't know anything about their surroundings, they're considered fairly "dumb". They are used by domain components, which provide them with properties and dispatch events that can be used by the outer components.

You can configure and customize design system components or replace them with your own. This enables you to build the required visual language throughout the application. Any reference to a design system component, like `<oryx-button>`, is resolved by your custom version regardless of where it's used.

Design system components are available in the `ui` package: `@spryker-oryx/ui`. They do not depend on any application logic, except for the integration of localized messages.

## Domain components

Oryx functionality is organized in domains. Domain packages contain functional components, also know as _domain components_. For example, all product-related components are organized in the product package.

Domain components leverage the design system components to ensure a consistent UI/UX. The design system components are integrated with inputs (properties), and all of their events are handled by domain components.

Domain components integrate with domain services to obtain and update the application state. The services handle the integration with backend APIs and application state management. In a single page application experience, domain components need to support [reactivity](/docs/oryx/reactivity/reactivity.md) to ensure the application state is reflected immediately after it is changed. The complexity of reactivity is avoided as much as possible in components by using [signals](/docs/oryx/reactivity/signals.md). To avoid repeating the boilerplate code that is required for each domain component, domains often provide a mixin. The mixin provides the required properties and signals that can be used by the components.

Each domain package contains associated domain components. Product components, for example, are part of the `@spryker-oryx/ui` package. The components use a consistent naming convention for class and element names. For example, the Product Title component, is named `ProductTitleComponent` and can be used with the `<oryx-product-title>` element. To avoid clashes with other frameworks, the elements are prefixed with `oryx-`.

## Composition components

Compositions are simple containers of components that are used to organize components on a page or a page section. The list of components and their options is configurable. The configurable approach allows for dynamic experiences that can be used to personalize or split-test experiences.

Because of this generic approach, all pages and their compositions are rendered as a single component only: `CompositionComponent` (`<oryx-composition>`). The composition component iterates over a list of components and applies layout and options to it.

To better understand the concepts of pages and compositions, see [Pages](/docs/oryx/building-pages/oryx-pages.md) and [Compositions](/docs/oryx/building-pages/oryx-compositions.md).

If you want to customize the application with your own pages, there's no need to follow the concept of compositions. You can create page-specific components, like `ProductDetailPageComponent`, and use them instead of using experience data.
