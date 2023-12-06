import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/Coupon`,
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
  },
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`<oryx-cart-coupon cartId="multiple"></oryx-cart-coupon>`;
};

export const Demo = Template.bind({});
