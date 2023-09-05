import { Guard } from '@spryker-oryx/core';
import { INJECTOR, inject } from '@spryker-oryx/di';
import { PriceModeChangeGuard } from '@spryker-oryx/site';
import { Observable } from 'rxjs';
import { CartService } from '../services';

export class CartPriceModeChangeGuard implements Guard {
  constructor(protected injector = inject(INJECTOR)) {}

  isAllowed(): Observable<boolean> {
    return this.injector.inject(CartService).isEmpty();
  }
}

declare global {
  interface InjectionTokensContractMap {
    [PriceModeChangeGuard]: Guard;
  }
}
