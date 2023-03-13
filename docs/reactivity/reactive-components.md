# Reactive components



## Domain logic

There are multiple ways for components to fetch data, but we recommend using the domain logic. Domain services provide a convenient API to request data. For example, when loading product data, the Product Service can be leveraged:

```ts
export class ProductPriceComponent extends LitElement {
  protected productService = resolve(ProductService);
  protected product$ = this.productService.get({ sku: '123' });
}
```

The `ProductPriceComponent` should ideally not be aware of the SKU, as this is provided by the context; the SKU might be resolved from the URL or from the context, i.e. from a cart entry component. Oryx provides a context controller that can be used to resolve the SKU. Different domains have their own controller to resolve the right qualifier from the context. In case of the product domain, we use the `ProductController`:

```ts
export class ProductPriceComponent extends LitElement {
  @property() sku?: string;
  protected productController = new ProductController(this);
  protected product$ = this.productController.get();
}
```

`ProductController` resolves the product qualifier (SKU) from the context and returns an observable from `ProductService`. If SKU is provided statically to the component, `ProductController` also takes `sku` as a component property into account. This can be useful in custom development or for demonstrating the component, for example, in a Storybook.

In the following code snippet, an observable is assigned to the local `product$` field. This will not do anything, since you need to _subscribe_ to an observable. There is a convenient approach in Oryx to subscribe using a decorator:

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

The `subscribe` decorator subscribes to the observable, but also unsubscribes when the component is destroyed. This ensures that there is no leaking memory in the application.

Another missing piece here is how the observed data can be used and rendered inside the component. This is described in the next section.

## Update the DOM

While the user navigates through pages in a single page application experience, it is crucial for components to be updated accordingly. This section describes how data updates are propagated throughout the user interface in Oryx.

RxJS operates on data streams and updates them in memory, but it doesn't synchronize this to the UI automatically. Each JavaScript framework ships its own opinionated method to update the DOM. The method of choice contributes significantly to the performance and user experience of the application.

The components provided in the Oryx libraries are build with Lit. Lit provides a highly efficient system to only synchronize the minimum required updates to the DOM. When updates are loaded asynchronously, the UI needs to be updated whenever new data is emitted. To make this as transparent as possible, a decorator (`@asyncState()`) is provided that can be used in the UI components. Under the hood, the decorator uses `AsyncStateController` which requests updates to the view when needed.

The following example shows the use of the `asyncState` decorator. The decorator subscribes to the assigned observable and requests an update to the component when needed. This means that as a component developer you do not need to worry about how the reactive system works under the hood.

Oryx components are build in TypeScript, which is why we need to ensure type safety. The original type of the assigned observable needs to be adjusted. It isn't possible to resolve a correct TypeScript type from the observable by using a decorator, which is why the `valueType` function is offered to project the observed type.

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

## Operate on multiple streams

Components often use multiple data streams. A good example is the product price which renders a product price in a certain currency and a _local_ price format. The currency and locale are part of the application context and may change during the application's lifecycle. The product price  changes from product to product. RxJS operators combine the various streams. They can combine multiple observables and operate on the combined results.

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

**Note:** the example is simplified to focus on the RxJs part.

In this example, the product data is observed from `ProductService`, but switches to the price formatting logic. This means that whenever the product changes (i.e. on route change), new product data is emitted and formatted. `PriceService` is used to format both the sales and original prices. `PriceService.format()` uses the current currency and locale for the formatting, which is why it also exposes an observable. Since there are two prices involved, the two streams are _combined_ in an object.

With this setup, the product price component receives updated prices whenever the product, currency or locale in the application state change. Subscribing to this code could simple, however more work is needed to ensure that the component UI (DOM) will be updated simultaneously. This is described in the next section.
