import { resolve, Type } from '@spryker-oryx/di';
import {
  ConnectableSignal,
  signal,
  signalAware,
} from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { map } from 'rxjs';
import { CheckoutProcessState } from '../models';
import { CheckoutService } from '../services';

export declare class CheckoutMixinInterface {
  protected checkoutService: CheckoutService;

  /**
   * Indicates that the checkout is ready for collecting checkout data.
   */
  protected isAvailable: ConnectableSignal<boolean>;
  protected isBusy: ConnectableSignal<boolean>;
}

export const CheckoutMixin = <T extends Type<LitElement>>(
  superClass: T
): Type<CheckoutMixinInterface> & T => {
  @signalAware()
  class CheckoutMixinClass extends superClass {
    protected checkoutService = resolve(CheckoutService);

    protected isAvailable = signal(
      this.checkoutService
        .getProcessState()
        .pipe(map((state) => state !== CheckoutProcessState.NotAvailable)),
      false
    );

    protected isBusy = signal(
      this.checkoutService
        .getProcessState()
        .pipe(map((state) => state === CheckoutProcessState.Busy)),
      false
    );
  }
  return CheckoutMixinClass as unknown as Type<CheckoutMixinInterface> & T;
};
