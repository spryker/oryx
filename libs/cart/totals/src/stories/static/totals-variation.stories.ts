import { CartService } from '@spryker-oryx/cart';
import { resolve } from '@spryker-oryx/injector';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { CartTotalsComponentAttributes } from '../../totals.model';

export default {
  title: `${storybookPrefix}/Cart totals/Static`,
  loaders: [
    (): void => {
      const cartService = resolve(CartService);
      cartService.getCart().subscribe((cart) => {
        if (cart && !cart.products?.length) {
          cartService.addEntry({ sku: '1', quantity: 1 }).subscribe();
          cartService.addEntry({ sku: '2', quantity: 3 }).subscribe();
        }
      });
    },
  ],
} as unknown as Meta;

const Template: Story<CartTotalsComponentAttributes> = (
  options: CartTotalsComponentAttributes
): TemplateResult => {
  return html`
    <h3>Subtotal</h3>
    <div class="row">
      <cart-totals .options=${options}></cart-totals>
      <cart-totals .options=${{ ...options, hideSubtotal: true }}></cart-totals>
    </div>

    <h3>Discounts</h3>
    <div class="row">
      <cart-totals .options=${options}></cart-totals>
      <cart-totals
        .options=${{ ...options, hideDiscounts: true }}
      ></cart-totals>
    </div>

    <h3>Discounts details (collapsed)</h3>
    <div class="row">
      <cart-totals .options=${options}></cart-totals>
      <cart-totals
        .options=${{ ...options, collapseDiscounts: true }}
      ></cart-totals>
    </div>

    <h3>Tax amount</h3>
    <div class="row">
      <cart-totals .options=${options}></cart-totals>
      <cart-totals
        .options=${{ ...options, hideTaxAmount: true }}
      ></cart-totals>
    </div>

    <h3>Tax message</h3>
    <div class="row">
      <cart-totals .options=${options}></cart-totals>
      <cart-totals
        .options=${{ ...options, hideTaxMessage: true }}
      ></cart-totals>
    </div>

    <style>
      .row {
        display: flex;
        margin-bottom: 24px;
        gap: 15px;
        align-items: flex-start;
      }

      .row > * {
        flex: 50%;
      }
    </style>

    <h3>Delivery</h3>
    <div class="row">
      <cart-totals .options=${options}></cart-totals>
      <cart-totals .options=${{ ...options, hideDelivery: true }}></cart-totals>
    </div>

    <h3>Expenses</h3>
    <div class="row">
      <cart-totals .options=${options}></cart-totals>
      <cart-totals .options=${{ ...options, hideExpense: true }}></cart-totals>
    </div>
  `;
};

export const CartTotalsVariation = Template.bind({});
