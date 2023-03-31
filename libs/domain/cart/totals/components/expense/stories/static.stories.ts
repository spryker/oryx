import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Cart totals/components/expense`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html` <h3>With value</h3>
    <oryx-cart-totals-expense></oryx-cart-totals-expense>
    <h3>Empty cart</h3>
    <oryx-cart-totals-expense cartId="empty"></oryx-cart-totals-expense>`;
};

export const variations = Template.bind({});
