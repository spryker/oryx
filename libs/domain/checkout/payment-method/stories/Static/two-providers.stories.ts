import { CheckoutDataService } from '@spryker-oryx/checkout';
import { MockCheckoutDataService } from '@spryker-oryx/checkout/mocks';
import { resolve } from '@spryker-oryx/di';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { mockPayments } from '../../../src/mocks/src/mock';

export default { title: `${storybookPrefix}/Payment/Static` } as Meta;

const Template: Story = (): TemplateResult => {
  resolve<MockCheckoutDataService>(CheckoutDataService).setMock({
    paymentMethods: [mockPayments[0], mockPayments[1]],
  });

  return html`<oryx-checkout-payment-method></oryx-checkout-payment-method>`;
};
export const TwoProvidersMethod = Template.bind({});
