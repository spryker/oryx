import { PaymentProviderType } from '@spryker-oryx/checkout/mocks';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { renderSelector } from '../helper';

export default {
  title: `${storybookPrefix}/Payment/Static`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`${renderSelector(PaymentProviderType.TwoProviders)}`;
};

export const TwoProvidersMethod = Template.bind({});
