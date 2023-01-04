import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { CartSummaryOptions } from '../summary.model';

export default {
  title: `${storybookPrefix}/Summary`,
  args: {
    maxVisibleQuantity: 99,
  } as CartSummaryOptions,
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta;

const Template: Story<CartSummaryOptions> = ({
  maxVisibleQuantity,
}: CartSummaryOptions): TemplateResult => {
  return html`<oryx-cart-summary
    cartId="large"
    .options=${{ maxVisibleQuantity }}
  ></oryx-cart-summary>`;
};

export const Demo = Template.bind({});
