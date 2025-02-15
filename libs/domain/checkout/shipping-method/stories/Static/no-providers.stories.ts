import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Shipment/Static`,
} as unknown as Meta;

const Template: Story = (): TemplateResult => {
  return html`<oryx-checkout-shipping-method></oryx-checkout-shipping-method>`;
};

export const NoProviders = Template.bind({});
