import { CartService } from '@spryker-oryx/cart';
import { resolve } from '@spryker-oryx/injector';
import { storybookDefaultViewports } from '@spryker-oryx/ui/utilities';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Entries/Static`,
  loaders: [
    (): void => {
      const cartService = resolve(CartService);

      cartService.getCart({ cartId: 'single' }).subscribe((cart) => {
        if (cart && !cart.products?.length) {
          cartService
            .addEntry({ sku: '4', quantity: 1, cartId: 'single' })
            .subscribe();
        }
      });

      cartService.getCart({ cartId: 'multiple' }).subscribe((cart) => {
        if (cart && !cart.products?.length) {
          cartService
            .addEntry({ sku: '1', quantity: 1, cartId: 'multiple' })
            .subscribe();
          cartService
            .addEntry({ sku: '2', quantity: 2, cartId: 'multiple' })
            .subscribe();
          cartService
            .addEntry({ sku: '3', quantity: 3, cartId: 'multiple' })
            .subscribe();
        }
      });
    },
  ],
} as unknown as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <p>Empty cart</p>
    <cart-entries .options=${{ cartId: 'default' }}></cart-entries>

    <p>Single entry</p>
    <cart-entries .options=${{ cartId: 'single' }}></cart-entries>

    <p>Multiple entries</p>
    <cart-entries .options=${{ cartId: 'multiple' }}></cart-entries>
  `;
};

export const States = Template.bind({});

States.parameters = {
  chromatic: {
    delay: 3000,
    viewports: [
      storybookDefaultViewports.mobile.min,
      storybookDefaultViewports.desktop.min,
    ],
  },
};
