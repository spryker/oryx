import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Shipment/Static`,
} as unknown as Meta;

const Template: Story = (): TemplateResult => {
  return html`<oryx-checkout-shipment></oryx-checkout-shipment>`;
};

export const NoProviders = Template.bind({});
