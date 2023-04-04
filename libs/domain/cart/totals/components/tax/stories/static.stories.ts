import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Cart totals/components/tax`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html` <h3>With value</h3>
    <oryx-cart-totals-tax></oryx-cart-totals-tax>
    <h3>Empty cart</h3>
    <oryx-cart-totals-tax cartId="empty"></oryx-cart-totals-tax>`;
};

export const variations = Template.bind({});
