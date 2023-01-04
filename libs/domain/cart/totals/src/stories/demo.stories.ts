import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { CartTotalsComponentOptions } from '../totals.model';

export default {
  title: `${storybookPrefix}/Cart totals`,
  args: {
    hideSubtotal: false,
    hideTaxAmount: false,
    hideTaxMessage: false,
    hideDiscounts: false,
    collapsibleDiscounts: true,
    collapseDiscounts: false,
    hideDelivery: false,
    hideExpense: false,
  } as CartTotalsComponentOptions,
  argTypes: {
    deliveryMessage: { control: { type: 'text' } },
  },
} as unknown as Meta;

const Template: Story<CartTotalsComponentOptions> = (
  options: CartTotalsComponentOptions
): TemplateResult => {
  return html`<cart-totals .options=${options}></cart-totals>`;
};

export const cartTotalsDemo = Template.bind({});
