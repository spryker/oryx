import {
  ConnectableSignal,
  Type,
  signal,
  signalAware,
} from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { OrderController } from '../controllers';
import { OrderComponentProperties, OrderData } from '../models';

export declare class OrderMixinInterface implements OrderComponentProperties {
  orderId?: string;

  protected $order: ConnectableSignal<OrderData>;
  protected orderController: OrderController;
}

export const OrderMixin = <
  T extends Type<LitElement & OrderComponentProperties>
>(
  superClass: T
): Type<OrderMixinInterface> & T => {
  @signalAware()
  class OrderMixinClass extends superClass {
    @property() orderId?: string;

    protected orderController = new OrderController(this);

    protected $order = signal(this.orderController.getOrder());
  }

  return OrderMixinClass as unknown as Type<OrderMixinInterface> & T;
};
