import {
  checkoutOrchestratorStaticData,
  MockCheckoutDataService,
} from '@spryker-oryx/checkout/mocks';
import { resolve } from '@spryker-oryx/di';
import { Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';
import { mockCarriers, mockPayments } from '../../src/mocks/src/mock';
import { CheckoutDataService } from '../../src/services';

export default {
  title: `${storybookPrefix}/Orchestrator`,
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
  },
};

const Template: Story = (): TemplateResult => {
  resolve<MockCheckoutDataService>(CheckoutDataService).setMock({
    paymentMethods: mockPayments,
    shipments: [{ id: '1', carriers: [mockCarriers[0]] }],
  });

  return html`<oryx-checkout-orchestrator
    .uid=${checkoutOrchestratorStaticData[0].id}
  ></oryx-checkout-orchestrator>`;
};

export const Demo = Template.bind({});
