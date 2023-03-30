import { CartService } from '@spryker-oryx/cart';
import { resolve } from '@spryker-oryx/di';
import { map, Observable, of } from 'rxjs';
import {
  Resolver,
  ResolversResult,
  TokenResolver,
} from '../token-resolver.service';

interface CartResolvers {
  SUMMARY: Resolver;
}

export class CartResolver implements TokenResolver {
  protected cartService$ = resolve(CartService);

  protected resolvers = {
    SUMMARY: (): ResolversResult => {
      return this.cartService$.getCart().pipe(
        map((cart) => {
          const quantity = cart?.products?.reduce(
            (acc, { quantity }) => acc + quantity,
            0
          );

          if (!quantity) {
            return null;
          }

          //TODO: Make max quantity to show configurable
          return quantity > 99 ? '99+' : String(quantity);
        })
      );
    },
  };

  resolve(resolver: string): Observable<string | null> {
    if (!(resolver in this.resolvers)) {
      return of(null);
    }
    return this.resolvers[resolver as keyof CartResolvers]();
  }
}
