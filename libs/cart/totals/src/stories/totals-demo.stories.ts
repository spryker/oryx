import { CartService } from '@spryker-oryx/cart';
import { resolve } from '@spryker-oryx/injector';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { CartTotalsComponentOptions } from '../totals.model';

export default {
  title: `${storybookPrefix}/Cart totals`,
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
  args: {
    hideTaxAmount: false,
    hideTaxMessage: false,
    hideDiscounts: false,
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
