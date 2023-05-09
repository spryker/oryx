import { resolve, Type } from '@spryker-oryx/di';
import {
  ConnectableSignal,
  signal,
  signalAware,
} from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { map } from 'rxjs';
import { CheckoutState } from '../models';
import { CheckoutService } from '../services';

export declare class CheckoutMixinInterface {
  protected checkoutService: CheckoutService;

  /**
   * Indicates that the checkout is ready for collecting checkout data.
   */
  protected isEmpty: ConnectableSignal<boolean>;
  protected isInvalid: ConnectableSignal<boolean>;
  protected isBusy: ConnectableSignal<boolean>;
}

export const CheckoutMixin = <T extends Type<LitElement>>(
  superClass: T
): Type<CheckoutMixinInterface> & T => {
  @signalAware()
  class CheckoutMixinClass extends superClass {
    protected checkoutService = resolve(CheckoutService);

    protected isEmpty = signal(
      this.checkoutService
        .getState()
        .pipe(map((state) => state === CheckoutState.Empty)),
      false
    );

    protected isBusy = signal(
      this.checkoutService
        .getState()
        .pipe(map((state) => state === CheckoutState.Busy)),
      false
    );

    protected isInvalid = signal(
      this.checkoutService
        .getState()
        .pipe(map((state) => state === CheckoutState.Invalid)),
      false
    );
  }
  return CheckoutMixinClass as unknown as Type<CheckoutMixinInterface> & T;
};
