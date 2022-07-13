import { delay, mapTo, Observable, of, take, tap, timer } from 'rxjs';
import { Cart, CartEntry } from '../models';
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

      products.splice(productIndex, 1, {
        ...productFromCart,
        quantity:
          Number(productFromCart.quantity) + Number(data.attributes.quantity),
      });
    } else {
      products.push({
        ...mockNormalizedCartEntry,
        sku: data.attributes.sku,
        groupKey: data.attributes.sku,
        quantity: data.attributes.quantity,
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
}
