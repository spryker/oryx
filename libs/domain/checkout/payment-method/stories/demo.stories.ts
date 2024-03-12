import {
  MockCheckoutDataService,
  mockPayments,
} from '@spryker-oryx/checkout/mocks';
import { resolve } from '@spryker-oryx/di';
import { Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';
import { CheckoutDataService } from '../../src/services';

export default { title: `${storybookPrefix}/Payment` };

const Template: Story = (): TemplateResult => {
  resolve<MockCheckoutDataService>(CheckoutDataService).setMock({
    paymentMethods: mockPayments,
  });

  return html`<oryx-checkout-payment-method></oryx-checkout-payment-method>`;
};

export const Demo = Template.bind({});
