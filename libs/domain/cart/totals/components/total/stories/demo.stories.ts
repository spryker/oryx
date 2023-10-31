import { TotalsContext } from '@spryker-oryx/cart';
import { ContextService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { CartTotalsTotalOptions } from '../total.model';

type Props = CartTotalsTotalOptions & {
  mode: string;
};

export default {
  title: `${storybookPrefix}/Cart Totals/components/Total`,
  args: {
    enableTaxMessage: false,
    mode: 'CART',
  },
  argTypes: {
    mode: {
      options: ['CART', 'CART-NET-MODE'],
      control: { type: 'select' },
    },
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta;

const bindContext = (context = 'CART', options?: CartTotalsTotalOptions) => {
  setTimeout(() => {
    resolve(ContextService).provide(
      document.getElementById(context)!,
      TotalsContext.Reference,
      context
    );
  }, 0);
  return html`
    <div id=${context}>
      <oryx-cart-totals-total .options=${options}></oryx-cart-totals-total>
    </div>
  `;
};

const Template: Story<Props> = ({ mode, ...options }): TemplateResult => {
  return bindContext(mode, options);
};

export const Demo = Template.bind({});
