import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../../.constants';
import { setupCartMocks } from '../../../../src/mocks/cart.mock';
import { CartTotalsComponentOptions } from '../../totals.model';

export default {
  title: `${storybookPrefix}/Cart totals/Static`,
  loaders: [setupCartMocks()],
} as unknown as Meta;

const Template: Story<CartTotalsComponentOptions> = (
  options: CartTotalsComponentOptions
): TemplateResult => {
  return html`
    <h3>With / Without discounts</h3>
    <div class="row">
      <cart-totals .options=${options}></cart-totals>
      <cart-totals
        .options=${{ ...options, showDiscounts: false }}
      ></cart-totals>
    </div>

    <h3>With / Without tax</h3>
    <div class="row">
      <cart-totals .options=${options}></cart-totals>
      <cart-totals .options=${{ ...options, showTax: false }}></cart-totals>
    </div>

    <h3>With / Without tax message</h3>
    <div class="row">
      <cart-totals .options=${options}></cart-totals>
      <cart-totals
        .options=${{ ...options, showTaxMessage: false }}
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
  `;
};

export const CartTotalsVariation = Template.bind({});

CartTotalsVariation.args = {
  showTax: true,
  showTaxMessage: true,
  showDiscounts: true,
  deliveryMessage: 'To Be Calculated',
};
