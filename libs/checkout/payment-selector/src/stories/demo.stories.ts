import { PaymentProviderType } from '@spryker-oryx/checkout/mocks';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { renderSelector } from './helper';

export default {
  title: `${storybookPrefix}/Payment Selector`,
} as unknown as Meta;

const Template: Story = (): TemplateResult => {
  return renderSelector(PaymentProviderType.Multiple);
};

export const PaymentSelectorDemo = Template.bind({});
