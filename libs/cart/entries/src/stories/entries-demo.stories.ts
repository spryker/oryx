import { CartService } from '@spryker-oryx/cart';
import { setupCartMocks } from '@spryker-oryx/cart/mocks';
import { useComponent } from '@spryker-oryx/core/utilities';
import { resolve } from '@spryker-oryx/injector';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../.constants';
import { cartEntriesComponent } from '../component';

useComponent(cartEntriesComponent);

export default {
  title: `${storybookPrefix}/Entries`,
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
} as unknown as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`<cart-entries></cart-entries>`;
};

export const Demo = Template.bind({});

Demo.parameters = {
  chromatic: { disableSnapshot: true },
};
