import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { CartTotalsComponentOptions } from '../totals.model';

export default {
  title: `${storybookPrefix}/Cart totals`,
  args: {
    enableSubtotal: false,
    enableTaxAmount: false,
    hideTaxMessage: false,
    enableDiscounts: false,
    collapsibleDiscounts: true,
    collapseDiscounts: false,
    enableDelivery: false,
    enableExpense: false,
  } as CartTotalsComponentOptions,
  argTypes: {
    deliveryMessage: { control: { type: 'text' } },
  },
} as unknown as Meta;

const Template: Story<CartTotalsComponentOptions> = (
  options: CartTotalsComponentOptions
): TemplateResult => {
  return html`<oryx-cart-totals .options=${options}></oryx-cart-totals>`;
};

export const cartTotalsDemo = Template.bind({});
