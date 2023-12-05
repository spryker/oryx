import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/List Item/Static`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <h4>Default</h4>
    <oryx-cart-list-item cartId="default"></oryx-cart-list-item>

    <h4>Default opened</h4>
    <oryx-cart-list-item cartId="default" open=></oryx-cart-list-item>

    <h4>Empty</h4>
    <oryx-cart-list-item cartId="empty"></oryx-cart-list-item>

    <h4>Empty opened</h4>
    <oryx-cart-list-item cartId="empty" open></oryx-cart-list-item>

    <h4>Net price mode</h4>
    <oryx-cart-list-item cartId="net"></oryx-cart-list-item>

    <h4>Net price mode opened</h4>
    <oryx-cart-list-item cartId="net" open></oryx-cart-list-item>

    <h4>Multiple entries</h4>
    <oryx-cart-list-item cartId="multiple"></oryx-cart-list-item>

    <h4>Multiple entries opened</h4>
    <oryx-cart-list-item cartId="multiple" open></oryx-cart-list-item>
  `;
};

export const Variants = Template.bind({});
