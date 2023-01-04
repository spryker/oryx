import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/PlaceOrder`,
} as unknown as Meta;

const Template: Story = (): TemplateResult => {
  return html`<checkout-place-order></checkout-place-order>`;
};

export const PlaceOrderDemo = Template.bind({});
