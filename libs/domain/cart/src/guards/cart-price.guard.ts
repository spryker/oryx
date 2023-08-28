import { inject } from '@spryker-oryx/di';
import { PriceModeChangeGuard } from '@spryker-oryx/site';
import { Observable } from 'rxjs';
import { CartService } from '../services';

export interface Guard {
  isAllowed(): Observable<boolean>;
}

export class CartPriceModeChangeGuard implements Guard {
  constructor(protected cartService = inject(CartService)) {}

  isAllowed(): Observable<boolean> {
    return this.cartService.isEmpty();
  }
}

declare global {
  interface InjectionTokensContractMap {
    [PriceModeChangeGuard]: Guard;
  }
}
