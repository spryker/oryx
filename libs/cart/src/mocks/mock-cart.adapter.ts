import { MockProductService, ProductOption } from '@spryker-oryx/product';
import { delay, mapTo, Observable, of, take, tap, timer } from 'rxjs';
import { Cart, CartCalculations, CartEntry } from '../models';
import {
  AddCartEntityProps,
  CartAdapter,
  DeleteCartEntityProps,
  GetCartProps,
  UpdateCartEntityProps,
} from '../services';
import {
  mockNormalizedCartEntry,
  mockNormalizedDefaultCartWithoutProducts,
} from './mock-cart';

export class MockCartAdapter implements Partial<CartAdapter> {
  private carts: Cart[] = [mockNormalizedDefaultCartWithoutProducts];
  private responseDelay = 300;

  private selectedProductOptions = [
    {
      optionGroupName: 'Three (3) year limited warranty',
      sku: 'OP_3_year_warranty',
      optionName: 'Three (3) year limited warranty',
      price: 2000,
    },
    {
      optionGroupName: 'Two (2) year insurance coverage',
      sku: 'OP_insurance',
      optionName: 'Two (2) year insurance coverage',
      price: 10000,
    },
    {
      optionGroupName: 'Gift wrapping',
      sku: 'OP_gift_wrapping',
      optionName: 'Gift wrapping',
      price: 500,
    },
  ];

  getAll(): Observable<Cart[]> {
    return of(this.carts).pipe(take(1));
  }

  get(data: GetCartProps): Observable<Cart> {
    const cart = this.findCart(data.cartId);

    return of(cart).pipe(delay(this.responseDelay));
  }

  addEntry(data: AddCartEntityProps): Observable<Cart> {
    const { cart, products, productIndex } = this.getInfo(
      data.cartId,
      data.attributes.sku
    );

    if (products.length && productIndex >= 0) {
      const productFromCart = products[productIndex];
      const quantity =
        Number(productFromCart.quantity) + Number(data.attributes.quantity);

      products.splice(productIndex, 1, {
        ...productFromCart,
        quantity,
        calculations: this.createCalculations(
          data.attributes.sku,
          quantity,
          this.selectedProductOptions
        ),
      });
    } else {
      products.push({
        ...mockNormalizedCartEntry,
        sku: data.attributes.sku,
        groupKey: data.attributes.sku,
        quantity: data.attributes.quantity,
        selectedProductOptions: this.selectedProductOptions,
        calculations: this.createCalculations(
          data.attributes.sku,
          data.attributes.quantity,
          this.selectedProductOptions
        ),
      });
    }

    const mappedCart = {
      ...cart,
      totals: {
        ...cart.totals,
        grandTotal: this.calculateCartTotal(products),
      },
      products,
    };

    return this.applyCartChanges(mappedCart);
  }

  updateEntry(data: UpdateCartEntityProps): Observable<Cart> {
    const { cart, products, productIndex } = this.getInfo(
      data.cartId,
      data.groupKey
    );

    products.splice(productIndex, 1, {
      ...products[productIndex],
      quantity: data.attributes.quantity,
      calculations: this.createCalculations(
        data.attributes.sku,
        data.attributes.quantity,
        this.selectedProductOptions
      ),
    });

    const mappedCart = {
      ...cart,
      totals: {
        ...cart.totals,
        grandTotal: this.calculateCartTotal(products),
      },
      products,
    };

    return this.applyCartChanges(mappedCart);
  }

  deleteEntry(data: DeleteCartEntityProps): Observable<null> {
    return timer(this.responseDelay).pipe(
      tap(() => {
        const { cart, products, productIndex } = this.getInfo(
          data.cartId,
          data.groupKey
        );

        products.splice(productIndex, 1);

        const cartIndex = this.carts.findIndex((item) => item.id === cart.id);

        this.carts.splice(cartIndex, 1, {
          ...cart,
          products,
        });
      }),
      mapTo(null)
    );
  }

  protected findCart(id: string): Cart {
    const cart = this.carts.find((item) => item.id === id);

    if (!cart) {
      throw new Error(`Cart with id ${id} is not exist`);
    }

    return cart;
  }

  protected getInfo(
    id: string,
    checkValue: string
  ): {
    cart: Cart;
    products: CartEntry[];
    productIndex: number;
  } {
    const cart = this.findCart(id);
    const products = cart.products ? [...cart.products] : [];
    const productIndex = products.findIndex(
      (product) => product.sku === checkValue || product.groupKey === checkValue
    );

    return { cart, products, productIndex };
  }

  protected applyCartChanges(mappedCart: Cart): Observable<Cart> {
    const cartIndex = this.carts.findIndex((cart) => cart.id === mappedCart.id);

    this.carts.splice(cartIndex, 1, mappedCart);

    return of(mappedCart).pipe(delay(this.responseDelay));
  }

  protected calculateCartTotal(products: CartEntry[]): number {
    let total = 0;

    for (let i = 0; i < products.length; i++) {
      total =
        total +
        products[i].quantity *
          (products[i]?.calculations?.unitPrice ||
            Math.floor(Math.random() * 10 + 1));
    }

    return total;
  }

  protected createCalculations(
    sku: string,
    quantity: number,
    options: ProductOption[]
  ): CartCalculations {
    const unitPrice =
      MockProductService.mockProducts.find((product) => product.sku === sku)
        ?.price?.defaultPrice?.value ?? 0;
    const sumPrice = unitPrice * quantity;
    const sumPriceToPayAggregation =
      options.reduce((sum, { price = 0 }) => sum + price, 0) + sumPrice;

    return {
      unitPrice,
      sumPrice,
      unitGrossPrice: unitPrice,
      sumGrossPrice: sumPrice,
      sumPriceToPayAggregation,
      sumSubtotalAggregation: sumPriceToPayAggregation,
    };
  }
}
