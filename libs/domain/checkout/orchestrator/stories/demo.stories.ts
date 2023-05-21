import {
  checkoutOrchestratorStaticData,
  MockCheckoutDataService,
} from '@spryker-oryx/checkout/mocks';
import { resolve } from '@spryker-oryx/di';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';
import { mockCarriers, mockPayments } from '../../src/mocks/src/mock';
import { CheckoutDataService } from '../../src/services';

export default {
  title: `${storybookPrefix}/Orchestrator`,
  args: {
    mockUid: 'singlePage',
  },
  argTypes: {
    mockUid: {
      control: { type: 'select' },
      options: checkoutOrchestratorStaticData.map((d) => d.id),
      table: { category: 'demo' },
    },
  },
} as Meta;

interface Props {
  mockUid: string;
}

const Template: Story<Props> = (props): TemplateResult => {
  resolve<MockCheckoutDataService>(CheckoutDataService).setMock({
    paymentMethods: mockPayments,
    shipments: [{ id: '1', carriers: [mockCarriers[0]] }],
  });

  return html`<oryx-checkout-orchestrator
    .uid=${props.mockUid}
  ></oryx-checkout-orchestrator>`;
};

export const Demo = Template.bind({});
