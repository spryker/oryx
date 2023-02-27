import { Type } from '@spryker-oryx/di';
import { asyncState, valueType } from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { CartController } from '../controllers';
import type {
  Cart,
  CartComponentAttributes,
  CartEntry,
  FormattedCartTotals,
} from '../models';

export declare class CartMixinInterface implements CartComponentAttributes {
  cartId?: string;
  cart?: Cart;

  protected cartController: CartController;

  protected entries?: CartEntry[];
  protected totals?: FormattedCartTotals;
  protected totalQuantity?: number;
}

export const CartComponentMixin = <
  T extends Type<LitElement & CartComponentAttributes>
>(
  superClass: T
): Type<CartMixinInterface> & T => {
  class CartMixinClass extends superClass {
    @property({ reflect: true }) cartId?: string;
    @property({ type: Object, reflect: true }) cart?: Cart;

    protected cartController = new CartController(this);

    @asyncState()
    protected entries = valueType(this.cartController.getEntries());

    @asyncState()
    protected totals = valueType(this.cartController.getTotals());

    @asyncState()
    protected totalQuantity = valueType(this.cartController.getTotalQuantity());
  }
  return CartMixinClass as unknown as Type<CartMixinInterface> & T;
};
