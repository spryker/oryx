import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Cart totals/components/discount`,
  parameters: { 
    chromatic: { 
       disableSnapshot: true 
    }
 },
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`<oryx-cart-totals-discount
    cartId="discount-multi-rows"
  ></oryx-cart-totals-discount>`;
};

export const demo = Template.bind({});
