import { Type } from '@spryker-oryx/di';
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { OrderController } from '../controllers';
import { OrderComponentProperties } from '../models';

export declare class OrderMixinInterface implements OrderComponentProperties {
  orderId?: string;

  protected orderController: OrderController;
}

export const OrderMixin = <
  T extends Type<LitElement & OrderComponentProperties>
>(
  superClass: T
): Type<OrderMixinInterface> & T => {
  class OrderMixinClass extends superClass {
    @property({ attribute: 'order-id' }) orderId?: string;

    protected orderController = new OrderController(this);
  }

  return OrderMixinClass as unknown as Type<OrderMixinInterface> & T;
};
