import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Cart totals/components/total`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html` <h3>Tax included</h3>
    <oryx-cart-totals-total></oryx-cart-totals-total>
    <h3>Tax excluded</h3>
    <oryx-cart-totals-total cartId="net"></oryx-cart-totals-total>
    <h3>Without tax message</h3>
    <oryx-cart-totals-total
      .options=${{ enableTaxMessage: false }}
    ></oryx-cart-totals-total>
    <h3>Empty cart</h3>
    <oryx-cart-totals-total cartId="empty"></oryx-cart-totals-total>`;
};

export const variations = Template.bind({});
