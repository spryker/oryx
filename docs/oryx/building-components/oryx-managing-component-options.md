---
title: "Oryx: Managing components options"
description: Components Options provide reusable components cross business models
last_updated: Sept 19, 2023
template: concept-topic-template
---

Oryx components support configurable options to make the components reusable in different business contexts. Component options are JavaScript objects that can be configured as part of the application configuration or added by providing an attribute. To ensure a good developer experience, each component type can provide an interface for the options.

To show the usage of component options, we use the tax message ("incl. vat") that is rendered on `ProductPriceComponent`. The tax message might not be useful for all businesses. For example, in a b2c context, the message might not be required. You can configure the message to be loaded conditionally.

## Setting up component options

Component options are provided by a TypeScript interface. This ensures a good developer experience when implementing a component and configuring the application. The component option interface is defined in a separate `*.model.ts` file in Oryx components, but there's no strict rule to follow.

```ts
export interface ProductPriceOptions {
  /**
   * Indicates whether to show tax message for the price.
   */
  enableTaxMessage?: boolean;
}
```

To resolve component options in new components, you can use `ContentMixin`. `ContentMixin` provides a type-safe `$option` [signal](/docs/oryx/architecture/reactivity/signals.html) that guarantees efficient usage of the options.

Oryx provides the `ContentMixin` mixin to work with component options. You can use the mixin to hand in the option interface. The following example shows how mixin is used to define the options.

```ts
export class ProductPriceComponent extends ContentMixin<ProductPriceOptions>(
  LitElement
) {
  // use the $options() signal in your code
}
```

## Configuring component options

There are different ways to configure component options. Components can have default option values that are used as a fallback in case no values are provided. [Feature sets](/docs/oryx/building-applications/oryx-feature-sets.html) can provide values for a specific business context. As an application developer, you can provide customized values, either for all component instances in the application configuration or by providing options per instance in the experience data. You can also override the options when using components in your code.

The approaches to set up the values are detailed in the following sections.

### Default component option values

To avoid hardcoded default values in the component code, components can have default values for their options. Oryx provides a `@defaultOptions` decorator that components can use to set up the values. The decorated values are used by the `ContentMixin` and are transparent for the component developer.

The default values are used as a fallback in case there are no specific values configured. Whenever more specific values are configured at a feature set or application, the default options are neglected.

```ts
@defaultOptions({
  enableTaxMessage: true,
})
export class ProductPriceComponent extends ContentMixin<ProductPriceOptions>(
  LitElement
) {
  // ...
}
```

### Configuring feature set component options

Default component options can be overridden in feature sets. [Feature sets](/docs/oryx/building-applications/oryx-feature-sets.html) simplify the setup of a specific business model, such as B2B or B2C. Besides providing page structures with components, feature sets can also add component configurations. The feature set configurations override default component values.

### Configuring application-driven component options

You can customize default component values and feature set values in the application configuration. The configuration is used every time the component is used in the application.

The following example shows how to configure an application using `appBuilder`.

```ts
export const app = appBuilder()
  // ...
  .withOptions({
    "oryx-product-price": {
      enableTaxMessage: false,
    },
  })
  .create();
```

For more information, see [Application orchestration](/docs/oryx/oryx-application-orchestration/oryx-application-orchestration.html).

### Configuring component option values in experience data

The default options, feature set configurations, and application configurations are applied to the Component type. The options provided in the experience data are applied to a specific instance in the experience data structure.

In the following configuration, you see a part of the experience data that sets the `enableSalesLabel` option to `false`. This configuration is only applied to the instance. This configuration does not affect the component when it's used elsewhere.

```ts
{
  type: 'oryx-composition',
  components: [
    {
      type: 'oryx-product-price',
      options: { enableSalesLabel: false },
    },
  ]
}
```

For more information about creating and customizing experience data, see [Oryx: Pages](/docs/oryx/building-pages/oryx-pages.html).

### Configuring hardcoded component options

When using components in code, options can be provided using the `options` attribute. The options attribute is resolved automatically by `ContentMixin` that most domain components use.

The following example shows how component options are written in the component `options` attribute. When options are added by an attribute, the web component specs require stringified JSON. [Lit](https://lit.dev) provides a convenient property mapping shown in the example below.

```ts
protected override render(): TemplateResult {

  const options: ProductPriceOptions = {
    enableSalesLabel: false;
  }
  return html`<oryx-product-price .options=${options}></oryx-product-price>`;
}
```

## Using component options

To use component options asynchronously, it is important to observe the options and react to updates in the component UI. Oryx provides a [reactive](/docs/oryx/architecture/reactivity/reactivity.html) framework with observable data streams that can update the UI using [signals](/docs/oryx/reactivity/signals.html). To simplify the integration in the component logic, `ContentMixin` provides the `$options` signal that can be called in the render logic or other signals.

The following code shows how to use the `$options` signal. Due to the component option interface, the usage of the signal is type safe.

```ts
@defaultOptions({
  enableTaxMessage: true,
})
export class ProductPriceComponent extends ContentMixin<ProductPriceOptions>(
  LitElement
) {
  protected override render(): TemplateResult {
    return html` ... ${this.renderTaxMessage()} ... `;
  }

  protected renderTaxMessage(): TemplateResult | void {
    if (!this.$options().enableTaxMessage) return;

    return html`...`;
  }
}
```
