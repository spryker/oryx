import { CartService } from '@spryker-oryx/cart';
import { useComponent } from '@spryker-oryx/core/utilities';
import { resolve } from '@spryker-oryx/injector';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../.constants';
import { setupCartMocks } from '../../../src/mocks/cart.mock';
import { cartEntriesComponent } from '../component';

useComponent(cartEntriesComponent);

export default {
  title: `${storybookPrefix}/Entries`,
  loaders: [
    setupCartMocks(),
    (): void => {
      const cartService = resolve(CartService);

      cartService.addEntry({ sku: '1', quantity: 1 }).subscribe();
      cartService.addEntry({ sku: '2', quantity: 3 }).subscribe();
    },
  ],
} as unknown as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`<cart-entries></cart-entries>`;
};

export const CartEntriesDemo = Template.bind({});

CartEntriesDemo.parameters = {
  chromatic: { disableSnapshot: true },
};
