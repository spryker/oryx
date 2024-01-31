---
title: Reactive components
description: Reactive components are built with Lit
template: concept-topic-template
last_updated: Jul 11, 2023
redirect_from:
  - /docs/scos/dev/front-end-development/202311.0/oryx/reactivity/reactive-components.html
---

Components are organized by domains-for example, components in a product domain. They can leverage domain logic to communicate with the associated backend API. Each domain is shipped with a domain service that provides an API to communicate with a backend API. For example, when rendering product data, `ProductService` can be used as follows:

```ts
export class ProductPriceComponent extends LitElement {
  protected productService = resolve(ProductService);
  protected product$ = this.productService.get({ sku: '123' });
}
```

To ensure that components are reusable in different contexts, it is recommended to not couple them directly with the qualifier that is used to load data. For example, `ProductPriceComponent` does not need to be aware of `SKU`, as `SKU` can be determined from the route of the product page, the product card in a list, or the cart entry. Oryx provides a mechanism to set up a so-called context. In the case of product components, the product controller is used to resolve the SKU from the context controller.

`ProductController` resolves the product qualifier (SKU) from the context and returns an observable from `ProductService`. If an SKU is provided statically to the component, `ProductController` also takes `sku` as a component property into account. This can be useful in custom development or for demonstrating the component—for example, in a Storybook.

```ts
export class ProductPriceComponent extends LitElement {
  @property() sku?: string;
  protected productController = new ProductController(this);
  protected product$ = this.productController.get();
}
```

To emit values, [observables](/docs/oryx/architecture/reactivity/key-concepts-of-reactivity.md) require to be subscribed to and unsubscribed when the values are no longer needed. To avoid such boilerplate code, you can use a decorator to subscribe and unsubscribe from observables. The decorator subscribes to the observable but also unsubscribes when the component is destroyed. This ensures that there's no leaking memory in the application. In the following snippet, an observable is assigned to the local `product$` field.

```ts
export class ProductPriceComponent {
  @subscribe()
  protected product$ = this.productService.get({ sku: '123' }).pipe(
    tap((product) => {
      //do stuff here
    })
  );
}
```

## Updating data in the DOM

While the user navigates thorugh a single page application, it's crucial for components to be updated accordingly. This section describes how data updates are propagated throughout the UI in Oryx.

RxJS operates on data streams and updates them in memory, but it doesn't synchronize this to the UI automatically. Each JavaScript framework ships its own opinionated method to update the DOM. The selected method contributes significantly to the performance and user experience of the application.

The components provided in the Oryx libraries are built with Lit. Lit provides a highly efficient system to only synchronize the minimum required updates to the DOM. When updates are loaded asynchronously, the UI needs to be updated every time new data is emitted. To make this as transparent as possible, the `@signalAware()` decorator is used in the UI components, allowing for `signals` to be used when building UI, which automatically requests updates to the view when needed.

The following example shows the usage of the `computed` signal. `Computed` wraps an observable into a `signal` that automatically subscribes to the underlying observable and triggers updating the view. This means that component developers don't need to worry about how the reactive system works under the hood.

```ts
export class ProductPriceComponent {
    protected $prices = computed(() => {
        return this.formatPrices(this.$product()?.price);
    });

  protected override render(): TemplateResult | void {
    return html`${this.$prices().defaultPrice}`;
  }
}
```

## Multiple data streams

Components often use multiple data streams. For example, the product price component renders a product price in a certain currency and a _local_ price format. The currency and locale are part of the application context and may change during the application's lifecycle. The product price changes from product to product. For managing these streams, you can leverage signals, which have the ability to combine multiple observables and operate on the combined results.


{% info_block infoBox "RxJS operators instead of signals" %}

If you want to manage more complex data stream operations, you can apply RxJS operators instead of signals.

{% endinfo_block %}


In the following example, `ProductPriceComponent` observes the product data from `ProductService` and _combines_ it with the formatted price given by `PriceService`.

```ts
export class ProductPriceComponent {
  protected productService = resolve(ProductService);
  protected priceService = resolve(PriceService);

  protected $product = signal(this.productService.getProduct());

  protected $prices = computed(() => this.formatPrices(this.$product()?.price));

  protected formatPrices(price?: ProductPrices): Observable<Prices> {
      return combineLatest({
          sales: this.pricingService.format(price?.defaultPrice),
          original: this.pricingService.format(price?.originalPrice),
      });
  }
}
```

In the preceding example, the product data is observed from `ProductService` by creating the `$product` signal. Whenever the product and its route change, new product data is emitted and formatted. `PriceService` formats the sales and the original prices. `PriceService.format()` uses the current currency and locale for the formatting, which is why it also exposes an observable. Since there are two prices involved, the two streams are _combined_ in an object and exposed as a computed signal to the component.

## Next steps

[Integration of backend APIs](/docs/oryx/architecture/reactivity/oryx-integration-of-backend-apis.md)
