import { AuthService } from '@spryker-oryx/auth';
import { App, AppPlugin } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { Subscription, tap } from 'rxjs';
import { OrderService } from './order.service';

export class OrderPlugin implements AppPlugin {
  protected subscription?: Subscription;

  getName(): string {
    return 'oryx$order';
  }

  apply(app: App): void {
    this.subscription = resolve(AuthService)
      .isAuthenticated()
      .pipe(
        tap((isAuthenticated) => {
          if (isAuthenticated) {
            resolve(OrderService).clearLastOrder();
          }
        })
      )
      .subscribe();
  }

  destroy(app?: App): void {
    this.subscription?.unsubscribe();
  }
}
