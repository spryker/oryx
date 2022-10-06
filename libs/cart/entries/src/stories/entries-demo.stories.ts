import { CartService } from '@spryker-oryx/cart';
import { resolve } from '@spryker-oryx/injector';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Entries`,
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

const Template: Story<unknown> = (): TemplateResult => {
  return html`<cart-entries></cart-entries>`;
};

export const Demo = Template.bind({});

Demo.parameters = {
  chromatic: { disableSnapshot: true },
};
