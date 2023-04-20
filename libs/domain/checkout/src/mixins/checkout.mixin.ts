import { Type } from '@spryker-oryx/di';
import { signalAware } from '@spryker-oryx/utilities';
import { LitElement } from 'lit';

// export const CheckoutComponentMixin = <T>(): Type<
//   LitElement & ContentComponentProperties<T>
// > => {
//   class CheckoutComponent extends ContentMixin<T>(LitElement) {}

//   return CheckoutComponent as Type<LitElement & ContentComponentProperties<T>>;
// };

export declare class CheckoutMixinInterface {}

export const CheckoutComponentMixin = <T extends Type<LitElement>>(
  superClass: T
): Type<CheckoutMixinInterface> & T => {
  @signalAware()
  class CheckoutMixinClass extends superClass {}
  return CheckoutMixinClass as unknown as Type<CheckoutMixinInterface> & T;
};
