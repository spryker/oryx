# Reactive components

Components are organized by domains, for example components in a product domain, and can leverage domain logic to communicate with the associated backend API. Each domain is shipped with a domain service that provides an API to communicate with a backend API. For example, when rendering product data, `ProductService` can be used as follows:

```ts
export class ProductPriceComponent extends LitElement {
  protected productService = resolve(ProductService);
  protected product$ = this.productService.get({ sku: '123' });
}
```

To ensure that components are reusable in different contexts, it is recommended to not couple them directly with the qualifier that is used to load data. For example, `ProductPriceComponent`does not need to be aware of the `SKU`, as the `SKU` can be determined from the route of the product page, the product card in a list, or the cart entry. Oryx provides a mechanism to setup a so-called context. In the case of product components, the product controller is used to resolve the SKU from the context controller.

`ProductController` resolves the product qualifier (SKU) from the context and returns an observable from `ProductService`. If SKU is provided statically to the component, `ProductController` also takes `sku` as a component property into account. This can be useful in custom development or for demonstrating the component, for example, in a Storybook.

```ts
export class ProductPriceComponent extends LitElement {
  @property() sku?: string;
  protected productController = new ProductController(this);
  protected product$ = this.productController.get();
}
```

To emit values, [observables](./key-concepts-of-reactivity.md) require to be subscribed to and unsubscribed when the values are no longer needed. To avoid such boilerplate code, you can use a decorator to subscribe and unsubscribe from observables. The decorator subscribes to the observable, but also unsubscribes when the component is destroyed. This ensures that there's no leaking memory in the application. In the following snippet, an observable is assigned to the local `product$` field.

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

While the user navigates thorugh a single page application, it is crucial for components to be updated accordingly. This section describes how data updates are propagated throughout the UI in Oryx.

RxJS operates on data streams and updates them in memory, but it doesn't synchronize this to the UI automatically. Each JavaScript framework ships its own opinionated method to update the DOM. The selected method contributes significantly to the performance and user experience of the application.

The components provided in the Oryx libraries are built with Lit. Lit provides a highly efficient system to only synchronize the minimum required updates to the DOM. When updates are loaded asynchronously, the UI needs to be updated every time new data is emitted. To make this as transparent as possible, the `@asyncState()` decorator is used in the UI components. Under the hood, the decorator uses `AsyncStateController` which requests updates to the view when needed.

The following example shows the usage of the `asyncState` decorator. The decorator subscribes to the assigned observable and requests an update to the component when needed. This means that component developers do not need to worry about how the reactive system works under the hood.

Oryx components are build in TypeScript, and we provide types everywhere to increase the developer experience and avoid error upfront. The original type of the assigned observable needs to be adjusted. It's impossible to resolve a correct type from the observable by using a decorator, which is why the `valueType` function is used to resolve the observed type.

```ts
export class ProductPriceComponent {
  @asyncState()
  protected prices = valueType(
    this.productController
      .getProduct()
      .pipe(switchMap((product) => this.formatPrices(product?.price)))
  );

  protected override render(): TemplateResult | void {
    return html`${this.prices.defaultPrice}`;
  }
}
```

## Multiple data streams

Components often use multiple data streams. For example, the product price component renders a product price in a certain currency and a _local_ price format. The currency and locale are part of the application context and may change during the application's lifecycle. The product price changes from product to product. RxJS operators combine the various streams. They can combine multiple observables and operate on the combined results.

In the following example, `ProductPriceComponent` observes the product data from `ProductService` and _combines_ it with the formatted price given by `PriceService`.

```ts
export class ProductPriceComponent {
  protected productService = resolve(ProductService);
  protected priceService = resolve(PriceService);

  protected prices = this.productService
    .getProduct()
    .pipe(switchMap((product) => this.formatPrices(product?.price)));

  protected formatPrices(
    price?: ProductPrices
  ): Observable<{ originalPrice: string | null; salesPrice: string | null }> {
    const salesPrice = this.priceService.format(price?.defaultPrice);
    const originalPrice = this.priceService.format(price?.originalPrice);
    return combineLatest({ salesPrice, originalPrice });
  }
}
```

**Note:** The example is simplified to focus on the RxJs part.

In this example, the product data is observed from `ProductService`, but switches to the price formatting logic. This means that, whenever the product and its route change, new product data is emitted and formatted. `PriceService` is used to format both the sales and original prices. `PriceService.format()` uses the current currency and locale for the formatting, which is why it also exposes an observable. Since there are two prices involved, the two streams are _combined_ in an object.

## Next steps

[Integration of backend APIs](./integration-of-backend-apis.md)
