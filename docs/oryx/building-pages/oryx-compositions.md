---
title: 'Oryx: Compositions'
description: Compositions are used to organize components and provide layout in Oryx applications
last_updated: June 8, 2023
template: concept-topic-template
redirect_from:
  - /docs/scos/dev/front-end-development/202311.0/oryx/oryx-compositions.html
---

Compositions in Oryx are a tool for organizing components and defining their layout. It removes page-specific layout concerns from the component implementation, which makes the components less opinionated and more reusable.

## Overview of compositions

A composition contains a list of components that are rendered in the DOM in their specific order. A composition itself is a component, which means that you can easily create nested composition structures. In fact, a page itself is a composition.

Compositions take a data-driven approach, letting you configure the composition using external data sources. This approach offers several potential benefits:

- Avoid hard-coded page layout: By using data to configure compositions, you can avoid hardcoding the page layout in your application code. Instead, you can define the structure and layout of your pages using external data, making it more flexible and easier to customize.

- Upgradable composition: A configurable data set is easier to upgrade. Instead of upgrading to a hardcoded component structure, you can select an alternative data set that will hold new components. This makes it easier to _opt in_ to alternative compositions.

- No-code customizations: The data-driven approach enables no-code customizations of the compositions. With the use of a What You See Is What You Get (WYSIWYG) tool, non-technical users can easily modify a composition by adjusting the data configuration without the need to edit the underlying code.

- Split testing of data sets: Data-driven compositions enable split testing of different data sets. This means that you can create alternative data configurations and perform A/B testing to compare their impact on user experience and performance. This provides valuable insights for optimizing your application.

- Personalization of data sets: The data-driven approach enables the personalization of a data set based on various criteria like user profiling, location, or time. You can tailor the composition data to provide personalized experiences to different target groups, enhancing user engagement and satisfaction.

- Alternative data sets per screen size: Oryx compositions support the configuration of alternative data sets based on screen sizes. You can define different experiences for different devices, such as mobile, tablet, and desktop. By adapting a data set based on screen size, you optimize the user experience.

The data-driven approach in Oryx compositions empowers you to dynamically configure the structure, layout, and content of your application based on external data sources. This flexibility enables easy customization, experimentation, and personalization, leading to enhanced user experiences and improved performance.

## Configuring compositions with data

To utilize the data-driven approach, you can provide the composition data using static-experience data or by loading the data from an external source like a backend API. For an example of how the static–experience data is provided, see [Feature sets](/docs/oryx/building-applications/oryx-feature-sets.md).

The data configuration for a composition typically includes information about the components: their order, layout rules, styling options, and any other properties relevant to the composition.

By separating the data configuration from the code, you can easily update and manage the composition without modifying the underlying application code. This promotes a more efficient development process and enables non-technical stakeholders to contribute to the composition customization.

## Nested compositions

Compositions can be nested. When you need to put in an additional structure for the organization and layout of a section, you can use a nested composition. A good example of nested compositions is the footer of an e-commerce storefront. The footer typically comes with a lot of links. The links are organized in groups, like self-service links, legal, and social. For a good experience, the groups have a layout assigned to them, to put them on the left or right, top or bottom of the footer.

## HTML produced by composition structure

The HTML produced by the composition component represents the composition hierarchy and defines the rendering order of components. Understanding the generated DOM structure is important for working effectively with compositions. The DOM structure is based on the experience data provided for each composition. It reflects the composition hierarchy and the components included in the compositions. The following is an example of a login page composition:

```ts
export const loginPage = {
  type: "Page",
  meta: { ... },
  options: { ... },
  components: [
    {
      type: "oryx-auth-login",
      options: {
        data: {
          rules: [{ width: "50%", margin: "auto" }],
        },
      },
    },
  ],
};
```

Based on the composition data, which only holds a single component, the following HTML is generated:

```html
<oryx-composition route="/login" uid="static129">
  <oryx-auth-login uid="static130"></oryx-auth-login>
  <style>
    :host([uid='static130']),
    [uid='static130'] {
      width: 50%;
      margin: auto;
    }
  </style>
</oryx-composition>
```

When the data structure does not provide a unique ID, a `uid` is autogenerated. The example shows the need to have a `uid`, as the data-driven styles are bound to elements with those UIDs. Nested compositions are added to the DOM, similar to other components. The following example shows the components of the _Cart_ page:

```html
<oryx-composition route="/cart" uid="static75">
  <oryx-cart-entries uid="static76"></oryx-cart-entries>
  <oryx-composition uid="static77" sticky>
    <oryx-cart-totals uid="static78"></oryx-cart-totals>
    <oryx-checkout-link uid="static79"></oryx-checkout-link>
  </oryx-composition>
</oryx-composition>
```

To learn more about Oryx presets and feature sets, which often work hand in hand with compositions, see [Presets](/docs/oryx/building-applications/oryx-presets.md) and [Feature sets](/docs/oryx/building-applications/oryx-feature-sets.md).
