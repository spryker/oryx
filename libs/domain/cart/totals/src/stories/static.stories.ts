import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import {
  CartTotalsComponentOptions,
  DiscountRowsAppearance,
} from '../totals.model';

export default {
  title: `${storybookPrefix}/Cart totals/Static`,
} as unknown as Meta;

const renderRow = (
  options: CartTotalsComponentOptions = {},
  id = 'gross',
  message?: string
): TemplateResult => html`
  <div class="row">
    <h3>No options</h3>
    <oryx-cart-totals .cartId=${id}></oryx-cart-totals>
    <h3>${message ?? id}</h3>
    <oryx-cart-totals .cartId=${id} .options=${options}></oryx-cart-totals>
  </div>
`;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    ${renderRow({ enableSubtotal: true }, 'gross', 'hide subtotals')}
    ${renderRow({ enableDiscount: true }, 'discount', 'hide discount')}
    ${renderRow(
      { discountRowsAppearance: DiscountRowsAppearance.Expanded },
      'discount',
      'expanded discount rows'
    )}
    ${renderRow(
      { discountRowsAppearance: DiscountRowsAppearance.Collapsed },
      'discount',
      'collapsed discount rows'
    )}
    ${renderRow(
      { discountRowsAppearance: DiscountRowsAppearance.Inline },
      'discount',
      'inline discount rows'
    )}
    ${renderRow(
      { discountRowsAppearance: DiscountRowsAppearance.None },
      'discount',
      'no discount rows'
    )}
    ${renderRow({ enableTax: true }, 'tax', 'tax amount')}
    ${renderRow({ hideTaxMessage: true }, 'net', 'tax message')}
    ${renderRow({ enableExpense: true }, 'expense')}
    ${renderRow({ enableDelivery: true }, 'gross', 'delivery')}

    <style>
      .row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }
      h3 {
        grid-row: 1;
      }
    </style>
  `;
};

export const CartTotalsVariation = Template.bind({});
