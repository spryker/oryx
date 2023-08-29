import { AuthService } from '@spryker-oryx/auth';
import { AppInitializer } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { Subscription, tap } from 'rxjs';
import { OrderService } from '../order.service';

export const GuestStorageInitializer = `${AppInitializer}GuestStorage`;

export class DefaultGuestStorageInitializer implements AppInitializer {
  protected subscription = new Subscription();

  constructor(
    protected orderService = inject(OrderService, null),
    protected authService = inject(AuthService, null)
  ) {}

  initialize(): void {
    if (!this.orderService || !this.authService) {
      return;
    }

    this.subscription = this.authService
      ?.isAuthenticated()
      .pipe(
        tap((isAuthenticated) => {
          if (isAuthenticated) {
            this.orderService?.clearLastOrder();
          }
        })
      )
      .subscribe();
  }

  onDestroy(): void {
    this.subscription.unsubscribe();
  }
}
