import { Type } from '@spryker-oryx/di';
import { signalAware } from '@spryker-oryx/utilities';
import { LitElement } from 'lit';

export declare class CheckoutMixinInterface {}

export const CheckoutComponentMixin = <T extends Type<LitElement>>(
  superClass: T
): Type<CheckoutMixinInterface> & T => {
  @signalAware()
  class CheckoutMixinClass extends superClass {}
  return CheckoutMixinClass as unknown as Type<CheckoutMixinInterface> & T;
};
