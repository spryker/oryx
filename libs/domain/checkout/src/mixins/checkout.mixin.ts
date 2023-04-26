import { AuthService } from '@spryker-oryx/auth';
import { CartService } from '@spryker-oryx/cart';
import { resolve, Type } from '@spryker-oryx/di';
import {
  ConnectableSignal,
  signal,
  signalAware,
} from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import {
  CheckoutDataService,
  CheckoutOrchestrationService,
  CheckoutService,
} from '../services';

export declare class CheckoutMixinInterface {
  protected checkoutService: CheckoutService;
  protected checkoutDataService: CheckoutDataService;
  protected orchestrationService: CheckoutOrchestrationService;

  protected isEmpty: ConnectableSignal<boolean>;
  protected isGuest: ConnectableSignal<boolean>;
  protected isAuthenticated: ConnectableSignal<boolean>;
}

export const CheckoutMixin = <T extends Type<LitElement>>(
  superClass: T
): Type<CheckoutMixinInterface> & T => {
  @signalAware()
  class CheckoutMixinClass extends superClass {
    protected authService = resolve(AuthService);
    protected checkoutService = resolve(CheckoutService);
    protected checkoutDataService = resolve(CheckoutDataService);
    protected orchestrationService = resolve(CheckoutOrchestrationService);

    protected isAuthenticated = signal(this.authService.isAuthenticated());
    protected isGuest = signal(this.checkoutDataService.isGuestCheckout());
    protected isEmpty = signal(resolve(CartService).isEmpty());
  }
  return CheckoutMixinClass as unknown as Type<CheckoutMixinInterface> & T;
};
