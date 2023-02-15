# Build reactive components with Oryx

## Integrate with domain logic

Components can use domain logic to fetch data. Domain services provide a convenient API to request data, e.g. in case of loading product data, the Product Service can be leveraged:

```ts
export class ProductPriceComponent extends LitElement {
  protected productService = resolve(ProductService);
  protected product$ = this.productService.get({ sku: '123' });
}
```

The `ProductPriceComponent` should ideally not be aware of the SKU, as this is provided by the context; the SKU might be resolved from the URL or from the context, i.e. from a cart entry component. Oryx provides a context controller that can be used to resolve the SKU. Different domains have their own controller to resolve the right qualifier from the context. In case of the product domain we use the `ProductController`:

```ts
export class ProductPriceComponent extends LitElement {
  @property() sku?: string;
  protected productController = new ProductController(this);
  protected product$ = this.productController.get();
}
```

The `ProductController`resolves the product qualifier (SKU) from the context and returns an observable from the `ProductService`. It will also take a component property (`sku`) into account, in case the SKU is provided statically to the component. This might be useful in custom development or in case of demonstrating the component (e.g. Storybook).

In these code snippet, an observable is assigned to the local `product$` field. This will not do anything, since you need to _subscribe_ to an observable. There's a convenient approach in Oryx to subscribe using a decorator:

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

The `subscribe` decorator will subscribe to the observable, but also unsubscribe when the component is destroyed. This will ensure that there's no leaking memory in the application.

Another missing piece here is how the observed data can be used and rendered inside the component. This is described in the next section.

## Update the DOM

While the user navigates through pages in a single page application experience, it's crucial for components to be updated accordingly. This section will explain how data updates are propagated throughout the user interface in Oryx.

RxJS conveniently operates on data streams and updates them in memory, but it won't synchronize this to the UI automatically. Each JavaScript framework ships its own opinionated method to update the DOM. The method of choice contributes significantly to the performance and user experience of the application.

The components provided in the Oryx libraries are build with Lit. Lit provides a highly efficient system to only synchronizes the minimum required updates to the DOM. When updates are loaded asynchronous, we need, however, to update the UI whenever new data is emitted. To make this as transparent as possible, a decorator (`@asyncState()`) is provided that can be used in the UI components. The decorator uses the `AsyncStateController` under the hood, which will request updates to the view whenever needed.

The following example shows the use of the `asyncState` decorator. The decorator subscribes to the assigned observable and requests an update to the component whenever a needed. This means that as a component developer you do not need to worry about how the reactive system works under the hood.

Oryx components are build in TypeScript, which is why we need to ensure type safety. The original type of the assigned observable needs to be adjusted. It's not possible to resolve correct TypeScript type from the observable by just using decorator, which is why the `valueType` function is offered to project the observed type.

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

Components often use multiple data streams. A good example is the product price which renders a product price in a certain currency and a _local_ price format. The currency and locale are part of the application context and might change during the application lifecycle. The product price will change from product to product. In order to combine the various streams, RxJS operators comes into play. RxJS operators can combine multiple observable and operate on the combined results.

This is illustrated in the example below, where the `ProductPriceComponent` observes the product data from the `ProductService` and _combines_ this with the formatted price given by the `PriceService`.

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

**Note:** the example is intentionally simplified to keep the focus on the RxJs part.

In this example code you can see that the product data is observed from the ProductService, but switches to the price formatting logic. This means that whenever the product changes (i.e. on route change), new product data is emitted and formatted. The `PriceService` is used to format both the sales and original price. The `PriceService.format()` uses the current currency and locale for the formatting, which is why it also exposes an observable. Since there are two prices involved, the two streams are _combined_ in an object.

With this setup, the product price component will receive updated prices whenever the product, currency or locale in the application state will change.Subscribing to this code could simple, however more work is needed to ensure that the component UI (DOM) will be updated simultaneously. This is described in the next section.
