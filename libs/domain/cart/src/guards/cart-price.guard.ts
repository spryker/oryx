import { Guard } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { Observable } from 'rxjs';
import { CartService } from '../services';

export class CartPriceModeChangeGuard implements Guard {
  constructor(protected cartService = inject(CartService)) {}

  isAllowed(): Observable<boolean> {
    return this.cartService.isEmpty();
  }
}
