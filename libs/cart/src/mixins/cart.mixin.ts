import {
  ComponentMixin,
  ContentComponentProperties,
} from '@spryker-oryx/experience';
import { Type } from '@spryker-oryx/typescript-utils';
import { LitElement } from 'lit';

export const CartComponentMixin = <T>(): Type<
  LitElement & ContentComponentProperties<T>
> => {
  class CartComponent extends ComponentMixin<T>() {}

  return CartComponent as Type<LitElement & ContentComponentProperties<T>>;
};
