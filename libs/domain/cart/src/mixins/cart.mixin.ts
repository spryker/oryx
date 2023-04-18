import { Type } from '@spryker-oryx/di';
import { signal, Signal, signalAware } from '@spryker-oryx/utilities';
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

  protected $isEmpty: Signal<boolean>;
  protected $isBusy: Signal<boolean>;
  protected $entries: Signal<CartEntry[]>;
  protected $totals: Signal<FormattedCartTotals | null>;
  protected $totalQuantity: Signal<number>;
}

export const CartComponentMixin = <
  T extends Type<LitElement & CartComponentAttributes>
>(
  superClass: T
): Type<CartMixinInterface> & T => {
  @signalAware()
  class CartMixinClass extends superClass {
    @property({ reflect: true }) cartId?: string;
    @property({ type: Object, reflect: true }) cart?: Cart;

    protected cartController = new CartController(this);

    protected $isEmpty = signal(this.cartController.isEmpty(), false);
    protected $isBusy = signal(this.cartController.isBusy(), false);
    protected $entries = signal(this.cartController.getEntries(), []);
    protected $totals = signal(this.cartController.getTotals(), null);
    protected $totalQuantity = signal(
      this.cartController.getTotalQuantity(),
      null
    );
  }
  return CartMixinClass as unknown as Type<CartMixinInterface> & T;
};
