import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default { title: `${storybookPrefix}/Payment/Static` } as Meta;

const Template: Story = (): TemplateResult => {
  return html`<oryx-checkout-payment-method></oryx-checkout-payment-method>`;
};

export const NoProvidersMethod = Template.bind({});
