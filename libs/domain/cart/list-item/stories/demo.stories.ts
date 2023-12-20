import { CartComponentAttributes } from '@spryker-oryx/cart';
import {
  mockCartLarge,
  mockCartWithDiscount,
  mockDefaultCart,
  mockEmptyCart,
  mockNetCart,
} from '@spryker-oryx/cart/mocks';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';

const cartIds = [
  mockDefaultCart,
  mockNetCart,
  mockEmptyCart,
  mockCartWithDiscount,
  mockCartLarge,
].map(({ id }) => id);

export default {
  title: `${storybookPrefix}/List Item`,
  args: {
    cartId: cartIds[0],
    open: false,
  },
  argTypes: {
    cartId: {
      control: { type: 'select' },
      options: cartIds,
    },
  },
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
  },
} as Meta;

const Template: Story<CartComponentAttributes> = ({
  cartId,
}): TemplateResult => {
  return html` <oryx-cart-list-item .cartId=${cartId}></oryx-cart-list-item> `;
};

export const Demo = Template.bind({});
