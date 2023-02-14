import { Type } from '@spryker-oryx/di';
import {
  ComponentMixin,
  ContentComponentProperties,
} from '@spryker-oryx/experience';
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import type { Cart, CartComponentAttributes } from '../models';

export const CartComponentMixin = <T>(): Type<
  LitElement & ContentComponentProperties<T>
> => {
  class CartComponent
    extends ComponentMixin<T>()
    implements CartComponentAttributes
  {
    @property({ type: String }) cartId?: string;
    @property({ type: Object }) cart?: Cart;
  }

  return CartComponent as Type<LitElement & ContentComponentProperties<T>>;
};
