import { TotalsContext } from '@spryker-oryx/cart';
import { ContextService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import {
  CartTotalsDiscountOptions,
  DiscountRowsAppearance,
} from '../discount.model';

type Props = CartTotalsDiscountOptions & {
  mode: string;
};

export default {
  title: `${storybookPrefix}/Cart Totals/components/Discount`,
  args: {
    discountRowsAppearance: DiscountRowsAppearance.Collapsed,
    mode: 'CART',
  },
  argTypes: {
    mode: {
      options: ['CART', 'CART-SINGLE-DISCOUNT'],
      control: { type: 'select' },
    },
    discountRowsAppearance: {
      options: Object.values(DiscountRowsAppearance),
      control: { type: 'select' },
    },
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta;

const bindContext = (context = 'CART', options?: CartTotalsDiscountOptions) => {
  setTimeout(() => {
    resolve(ContextService).provide(
      document.getElementById(context)!,
      TotalsContext.Reference,
      context
    );
  }, 0);
  return html`
    <div id=${context}>
      <oryx-cart-totals-discount
        .options=${options}
      ></oryx-cart-totals-discount>
    </div>
  `;
};

const Template: Story<Props> = ({ mode, ...options }): TemplateResult => {
  return bindContext(mode, options);
};

export const Demo = Template.bind({});
