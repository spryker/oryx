import {
  AddCartEntryQualifier,
  Cart,
  CartAdapter,
  CartCalculations,
  CartEntry,
  CartEntryQualifier,
  CartQualifier,
  ProductOption,
  UpdateCartEntryQualifier,
} from '@spryker-oryx/cart';
import { MockProductService } from '@spryker-oryx/product/mocks';
import { Observable, delay, mapTo, of, take, tap, timer } from 'rxjs';
import {
  mockCartEntry,
  mockCartLarge,
  mockCartWithDiscount,
  mockCartWithExpense,
  mockCartWithMultipleDiscount,
  mockCartWithMultipleProducts,
  mockCartWithTax,
  mockDefaultCart,
  mockEmptyCart,
  mockNetCart,
} from './mock-cart';

export class MockCartAdapter implements Partial<CartAdapter> {
  private carts: Cart[] = [
    mockDefaultCart,
    mockNetCart,
    mockEmptyCart as Cart,
    mockCartWithExpense,
    mockCartWithMultipleDiscount,
    mockCartWithDiscount,
    mockCartLarge,
    mockCartWithTax,
    mockCartWithMultipleProducts,
  ];

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

  get(data: CartQualifier): Observable<Cart> {
    const cart = this.findCart(data.cartId!);

    return of(cart).pipe(delay(this.responseDelay));
  }

  addEntry(data: AddCartEntryQualifier): Observable<Cart> {
    const { cart, products, productIndex } = this.getInfo(
      data.cartId!,
      data.sku
    );

    if (products.length && productIndex >= 0) {
      const productFromCart = products[productIndex];
      const quantity = Number(productFromCart.quantity) + Number(data.quantity);

      products.splice(productIndex, 1, {
        ...productFromCart,
        quantity,
        calculations: this.createCalculations(
          data.sku,
          quantity,
          this.selectedProductOptions
        ),
      });
    } else {
      products.push({
        ...mockCartEntry,
        sku: data.sku,
        groupKey: data.sku,
        quantity: data.quantity ?? 1,
        selectedProductOptions: this.selectedProductOptions,
        calculations: this.createCalculations(
          data.sku,
          data.quantity ?? 1,
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

  updateEntry(data: UpdateCartEntryQualifier): Observable<Cart> {
    const { cart, products, productIndex } = this.getInfo(
      data.cartId!,
      data.groupKey!
    );

    products.splice(productIndex, 1, {
      ...products[productIndex],
      quantity: data.quantity,
      calculations: this.createCalculations(
        products[productIndex].sku,
        data.quantity,
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

  deleteEntry(data: CartEntryQualifier): Observable<null> {
    return timer(this.responseDelay).pipe(
      tap(() => {
        const { cart, products, productIndex } = this.getInfo(
          data.cartId!,
          data.groupKey!
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
        Number(products[i].quantity) *
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
