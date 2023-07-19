import { CheckoutDataService } from '@spryker-oryx/checkout';
import {
  MockCheckoutDataService,
  mockPayments,
} from '@spryker-oryx/checkout/mocks';
import { resolve } from '@spryker-oryx/di';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default { title: `${storybookPrefix}/Payment/Static` } as Meta;

const Template: Story = (): TemplateResult => {
  resolve<MockCheckoutDataService>(CheckoutDataService).setMock({
    paymentMethods: [mockPayments[0]],
  });

  return html`<oryx-checkout-payment-method></oryx-checkout-payment-method>`;
};

export const SingleProviderMethod = Template.bind({});
