import { CartQualifier, CartService } from '@spryker-oryx/cart';
import { resolve } from '@spryker-oryx/injector';
import { map, Observable } from 'rxjs';

export class CartController {
  protected cartService = resolve(CartService);

  getTotalItemsQuantity(data?: CartQualifier): Observable<number> {
    return this.cartService
      .getEntries(data)
      .pipe(
        map((products) =>
          products.reduce((acc, { quantity }) => acc + quantity, 0)
        )
      );
  }
}
