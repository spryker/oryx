import { CartService } from '@spryker-oryx/cart';
import { useComponent } from '@spryker-oryx/core/utilities';
import { resolve } from '@spryker-oryx/injector';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../.constants';
import { setupCartMocks } from '../../../src/mocks';
import { cartTotalsComponent } from '../totals.def';
import { CartTotalsComponentAttributes } from '../totals.model';

useComponent(cartTotalsComponent);

export default {
  title: `${storybookPrefix}/Cart totals`,
  loaders: [
    setupCartMocks(),
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
  } as CartTotalsComponentAttributes,
  argTypes: {
    deliveryMessage: { control: { type: 'text' } },
  },
} as unknown as Meta;

const Template: Story<CartTotalsComponentAttributes> = (
  options: CartTotalsComponentAttributes
): TemplateResult => {
  return html`<cart-totals .options=${options}></cart-totals>`;
};

export const cartTotalsDemo = Template.bind({});
