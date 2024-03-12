---
title: 'Oryx: Implementing components'
description: Learn how to create an Oryx component
last_updated: Sept 20, 2023
template: concept-topic-template
---

Oryx components are web components built with [Lit](https://lit.dev). Lit is a lightweight open-source framework from Google that's used to build highly efficient web components. Web components can be created with any framework or even with vanilla HTML, CSS, and JavaScript. You can use any other framework instead of Lit. However, some Oryx utilities, like [signals](/docs/oryx/architecture/reactivity/signals.md) and component mixins, are available only with Lit.

## Implementing a component

This document describes how to implement a component using Lit. Lit's standard concepts are not covered. To learn more about them, see [Components overview](https://lit.dev/docs/components/overview/).

We use the product _ID_ component as an example. It is a simple component that shows the basic concepts. The component already exists in the Oryx product package.

In Oryx, components are organized in folders, like `src/product/id`, with some component logic located in separate files. However, you can create a component as a single file. To allow for lazy loading of the component, you still need to separate out its definition.

### 1. Creating a component class

Oryx components are based on the Web Components standard. One of the features of web components are custom elements. Custom elements are class-based elements that extend from `HTMLElement`. Lit provides `LitElement` as a base class to extend from when you create a custom element.

```ts
import { LitElement, TemplateResult } from 'lit';

export class ProductIdComponent extends LitElement {
  protected override render(): TemplateResult {
    return html`<h1>The product id...</h1>`;
  }
}
```

Oryx components follow the naming convention for class names: `[Domain][Feature]Component`. In the example of the `ProductIdComponent` component, `Domain` is `Product`, and `Feature` is `Id`.

{% info_block infoBox %}

Oryx is built in TypeScript with strict typing configuration. This ensures high-quality standards and a good developer experience. If you use TypeScript in your code, which is optional, you define the typing configuration in `.tsconfig`.

{% endinfo_block %}

### 2. Integrating backend data

In this step, you're going to resolve the product data and render the `id` field of the data. The product data comes from the backend API and is loaded asynchronously. Once the data is loaded, it's part of the _application state_. The state might change over time—for example, when a user navigates from one product page to another. To be able to render the state efficiently, the component must support [reactivity](/docs/oryx/architecture/reactivity/reactivity.md).

Oryx provides standard [application layers](/docs/oryx/architecture/reactivity/key-concepts-of-reactivity.html#application-layers) to load and resolve the backend data. The service layer is intended to be used by components, and product components interact with `ProductService`. The integration with the product service and reactivity is simplified by using `ProductMixin`. Mixins provide component properties and methods, which you can use in components.

{% info_block infoBox "Inheritance versus composition" %}

While component classes extend from a base class, Oryx mostly avoids inheritance and uses the _composition_ design pattern. Not all the component logic can be composed, which is why mixins are used.

{% endinfo_block %}

The following example shows how to extend from `ProductMixin` and consume the product data.

```ts
import { LitElement, TemplateResult } from 'lit';
import { ProductMixin } from '@spryker-oryx/product';

export class ProductIdComponent extends ProductMixin(LitElement) {
  protected override render(): TemplateResult {
    return html`id: ${this.$product()?.id}`;
  }
}
```

This code shows the ease of use, but there's a lot going on in the background:

1. The product _context_ (sku) is resolved from the URL or any of the component's ancestor DOM elements, depending on where the component is used. When the component is used inside a product card or cart entry, the `sku` is added as an attribute. When the component is used on the Product Details Page, the `sku` is resolved from the URL. The current locale and currency are used as additional context. When the context is changing, the product data is reloaded automatically.
2. `ProductService` is used to resolve the product data from the application state. When the product is not yet loaded from the backend, the service uses the `ProductAdapter` adapter to fetch the data. The HTTP response is converted to meet the client-side product model. _Command and Query_, Oryx's state management solution, prevents data reloading unless explicitly requested.
3. The `$product` signal subscribes to the application state using `ProductService`. Whenever the product state is changed, the [signal](/docs/oryx/architecture/reactivity/signals.md) updates the associated DOM elements that are affected by the data.

The preceding steps are a commonly used pattern across all Oryx domain components. It ensures efficient consumption of backend APIs and rendering of DOM elements.

### 3. Configuring a component

Oryx components can be made configurable with options. [Component options](/docs/oryx/building-components/oryx-managing-component-options.md) can be provided statically to the application or load from a backend API. Component options enable components to be reusable across different business models. For example, a component can render different results based on the provided option: `true` for a B2C application, but `false` for a B2B application.

Component options are resolved by `ContentMixin`, similar to how `ProductService` resolves the product data. You can combine multiple mixins in a component implementation—for example:

```ts
import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { ProductMixin } from '@spryker-oryx/product';

interface ProductIdOptions {
  myOption?: boolean;
}

export class ProductIdComponent extends ProductMixin(
  ContentMixin<ProductIdOptions>(LitElement)
) {
  protected override render(): TemplateResult {
    const { myOption } = this.$options();

    if (!myOption) return;

    return html`id: ${this.$product()?.id}`;
  }
}
```

You can provide default options in the component, in feature sets, or in the application. For more details, see [Component options](/docs/oryx/building-components/oryx-managing-component-options.md).

### 4. Styling the component DOM

Oryx components are styled with standard CSS. The components have a separate DOM attached using the open [shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM). The shadow DOM encapsulates the styles so that they cannot _leak_ into other components and prevents global styles from cascading down to the component.

Styling components in the shadow DOM is a big topic we recommend studying separately. However, there are a few things to know when it comes to Oryx and styling components:

- Design system components are provided in the UI package. Components like `<oryx-button>` or `<oryx-link>` are used to ensure a common visual language. They can be customized. If your components use the design system as much as possible, you have a consistent design language throughout your application.
- While web components styles do not leak in other components, the font style rules like `font-face` or `font-size` do cascade into web components, no matter how deep they are nested. Standard font rules are provided therefor in the `<oryx-app>` component. The [typography](/docs/oryx/building-applications/styling/oryx-typography.md) design tokens are used to ensure consistent styling.
- Custom properties, also known as CSS variables, cascade into web components, which is why the application theme is based on CSS variables. See [Design tokens](/docs/oryx/building-applications/styling/oryx-design-tokens.html) for more information.
- Oryx uses configurable breakpoints to set up the screen size for responsive designs. To avoid hardcoded breakpoints in the component styles, you can configure screen-specific styles in the component definition as described in the following sections.
- You can use Oryx themes and provide component styles for a specific theme. Similarly to breakpoint-specific styles, you can configure styles for a theme.
- Oryx provides an [icon system](/docs/oryx/building-applications/styling/oryx-icon-system.html) that you can leverage in your components.

### 5. Localizing messages

Components often require some text labels or aria labels to guide the user. To support multiple locales, you can leverage [localization](/docs/oryx/building-applications/oryx-localization.html).

Localizations are resolved asynchronously, and require the UI to be rerendered whenever they're loaded or reloaded. `ContentMixin`, which you've used earlier to integrate the component options, provides access to the `i18n` directive. The `i18n` directive is available as a class method. The following example shows how to use it:

```ts
protected render(): TemplateResult | void {
  return html`${this.i18n('cart.add-to-cart')}`;
}
```

If you do not use `ContentMixin`, you can use `I18nMixin` instead. If you choose to not use mixins, you can integrate the `i18n` directive directly.

### 6. Using services inside the component

You've seen how `ProductMixin` resolves the product data and hides the integration with the `ProductService`. It is also common to use services directly in components. Oryx _injects_ services using [dependency injection (DI)](/docs/oryx/architecture/dependency-injection/dependency-injection.html). DI provides decoupling of components and shared business logic. This is a common design pattern that separates concerns and lets you customize services without touching the components or other depending services.

The Oryx DI container is used to register and resolve services using a token. You can read more about resolving services in [Dependency Injection: Using services](/docs/oryx/architecture/dependency-injection/dependency-injection-using-services.html). The following example shows how the pricing service is resolved.

```ts
import { resolve } from '@spryker-oryx/di';
import { ProductMixin } from '@spryker-oryx/product';
import { PricingService } from '@spryker-oryx/site';
import { LitElement } from 'lit';

export class ProductIdComponent extends ProductMixin(LitElement) {
  protected pricingService = resolve(PricingService);
}
```

You can now use the pricing service API in the component. Service methods always return observables (using [RxJS](https://rxjs.dev/)), so that the service can be lazy loaded and the response can be used by [signals](/docs/oryx/architecture/reactivity/signals.html) to update the DOM efficiently.

### 7. Configuring the component for server-side rendering and hydration

If your application needs to be indexed by crawlers, such as Google Search or Pinterest, the application needs to be [server-side rendered](/docs/oryx/architecture/oryx-server-side-rendering.html).

When a component is server-side rendered, some of the browser APIs are not available. Most commonly known are the `window` and `document` objects. Take this into account when implementing custom components.

Oryx renders pages on the server and returns the minimum amount of JavaScript needed. A component doesn't need JavaScript initially, but when a user start interacting with it, or when the component needs to reflect a certain application state, additional JavaScript needs to be loaded. Loading the component logic at the client side is called _hydration_. Because the component logic is loaded over the network and initialized in the application, hydration is costly. Additionally, the component might need to fetch data from a backend API. Oryx therefore tries to avoid or delay hydration till it is needed.

When developing a component, you need to configure the hydration trigger using the `@hydrate` decorator that can take an event or context. The following example shows how to set up the component to be hydrated when the context is changed:

```ts
import { resolve } from '@spryker-oryx/di';
import { ProductMixin } from '@spryker-oryx/product';
import { hydrate } from '@spryker-oryx/utilities';

@hydrate({ context: ProductContext.SKU })
export class ProductIdComponent extends ProductMixin(LitElement) {
  // ...
}
```

Alternatively, you can configure hydration to be triggered by a specific event:

```ts
@hydrate({ event: ['mouseover', 'focus'] })
export class ProductIdComponent extends ProductMixin(LitElement) {
  // ...
}
```

## Registering the component definition

The component implementation you've started building in the previous section is not imported anywhere in your application. You need to register the [component definition](/docs/oryx/building-components/oryx-providing-component-definitions.html) so that the application can get hold of it, whenever it needs to render the component.

In the example below, you see how the component is registered inline in the appBuilder. However, we recommend creating a component definition in a separate file and maintain it in the component folder.

```ts
import { appBuilder } from '@spryker-oryx/application';

export const app = appBuilder().withComponents([
  {
    name: 'oryx-product-id',
    impl: () => import('./components/product/id.component'),
  },
]);
```

## Using the component in the page structure

After you've implemented and registered the component, you can use it in the application. For example, in a [page](/docs/oryx/building-pages/oryx-pages.html) or [composition](/docs/oryx/building-pages/oryx-compositions.html), or inside CMS content.

If you build your first component, you might want to skip creating custom pages altogether, and just see the component in action. You can quickly merge the component into an existing page structure. For example, add the component before or after an existing component. For more details, see [Oryx: Pages](/docs/oryx/building-pages/oryx-pages.html).

Also, you can merge the component into an existing page structure. For example, before or after an existing component or inside (prepend or append) the components of an existing composition.
