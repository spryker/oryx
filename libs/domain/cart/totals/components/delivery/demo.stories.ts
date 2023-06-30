import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Cart totals/components/delivery`,
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
  },
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`<oryx-cart-totals-delivery></oryx-cart-totals-delivery>`;
};

export const cartTotalsDemo = Template.bind({});
