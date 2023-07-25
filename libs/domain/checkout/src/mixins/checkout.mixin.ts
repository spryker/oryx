import { resolve } from '@spryker-oryx/di';
import {
  ConnectableSignal,
  Type,
  signal,
  signalAware,
} from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { map } from 'rxjs';
import { CheckoutStatus } from '../models';
import {
  CheckoutDataService,
  CheckoutService,
  CheckoutStateService,
} from '../services';

export declare class CheckoutMixinInterface {
  protected checkoutService: CheckoutService;
  protected checkoutDataService: CheckoutDataService;
  protected checkoutStateService: CheckoutStateService;

  /**
   * Indicates that the checkout is ready for collecting checkout data.
   */
  protected $isEmpty: ConnectableSignal<boolean>;
  protected $isInvalid: ConnectableSignal<boolean>;
  protected $isBusy: ConnectableSignal<boolean>;
}

export const CheckoutMixin = <T extends Type<LitElement>>(
  superClass: T
): Type<CheckoutMixinInterface> & T => {
  @signalAware()
  class CheckoutMixinClass extends superClass {
    protected checkoutService = resolve(CheckoutService);
    protected checkoutDataService = resolve(CheckoutDataService);
    protected checkoutStateService = resolve(CheckoutStateService);

    protected $isEmpty = signal(
      this.checkoutService
        .getStatus()
        .pipe(map((state) => state === CheckoutStatus.Empty)),
      { initialValue: false }
    );

    protected $isBusy = signal(
      this.checkoutService
        .getStatus()
        .pipe(map((state) => state === CheckoutStatus.Busy)),
      { initialValue: false }
    );

    protected $isInvalid = signal(this.checkoutStateService.isInvalid(), {
      initialValue: false,
    });
  }
  return CheckoutMixinClass as unknown as Type<CheckoutMixinInterface> & T;
};
