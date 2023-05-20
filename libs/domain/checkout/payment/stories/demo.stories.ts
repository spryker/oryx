import { resolve } from '@spryker-oryx/di';
import { Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';
import { MockCheckoutDataService } from '../../src/mocks/src';
import { mockPayments } from '../../src/mocks/src/mock';
import { CheckoutDataService } from '../../src/services';

export default { title: `${storybookPrefix}/Payment` };

const Template: Story = (): TemplateResult => {
  resolve<MockCheckoutDataService>(CheckoutDataService).setMock(mockPayments);

  return html`<oryx-checkout-payment></oryx-checkout-payment>`;
};

export const Demo = Template.bind({});
