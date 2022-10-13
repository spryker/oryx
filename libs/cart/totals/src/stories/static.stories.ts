import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Cart totals/Static`,
} as unknown as Meta;

const renderRow = (
  options = {},
  id = 'gross',
  message?: string
): TemplateResult => html`
  <div class="row">
    <h3>With ${message ?? id}</h3>
    <cart-totals .cartId=${id}></cart-totals>
    <h3>Without ${message ?? id}</h3>
    <cart-totals .cartId=${id} .options=${options}></cart-totals>
  </div>
`;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    ${renderRow({ hideSubtotal: true }, 'gross', 'subtotals')}
    ${renderRow({ hideSubtotal: true }, 'multiple', 'subtotals (multiple)')}
    ${renderRow({ hideDiscounts: true }, 'discount')}
    ${renderRow(
      { collapseDiscounts: true },
      'discount',
      'discount (collapsed)'
    )}
    ${renderRow({ hideTaxAmount: true }, 'tax', 'tax amount')}
    ${renderRow({ hideTaxMessage: true }, 'net', 'tax message')}
    ${renderRow({ hideExpense: true }, 'expense')}
    ${renderRow({ hideDelivery: true }, 'gross', 'delivery')}

    <style>
      .row {
        display: grid;
        grid-template-columns: 1fr 1fr;
      }
      h3 {
        grid-row: 1;
      }
    </style>
  `;
};

export const CartTotalsVariation = Template.bind({});
