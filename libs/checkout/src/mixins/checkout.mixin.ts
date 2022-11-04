import {
  ComponentMixin,
  ContentComponentProperties,
} from '@spryker-oryx/experience';
import { Type } from '@spryker-oryx/utilities';
import { LitElement } from 'lit';

export const CheckoutComponentMixin = <T>(): Type<
  LitElement & ContentComponentProperties<T>
> => {
  class CheckoutComponent extends ComponentMixin<T>() {}

  return CheckoutComponent as Type<LitElement & ContentComponentProperties<T>>;
};
