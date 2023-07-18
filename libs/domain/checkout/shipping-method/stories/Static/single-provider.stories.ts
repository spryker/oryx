import { CheckoutDataService, Shipment } from '@spryker-oryx/checkout';
import {
  MockCheckoutDataService,
  mockCarriers,
} from '@spryker-oryx/checkout/mocks';
import { resolve } from '@spryker-oryx/di';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default { title: `${storybookPrefix}/Shipment/Static` } as Meta;

const mock: Partial<Shipment>[] = [
  {
    id: '1',
    carriers: [mockCarriers[0]],
  },
];

const Template: Story = (): TemplateResult => {
  resolve<MockCheckoutDataService>(CheckoutDataService).setMock({
    shipments: mock,
  });

  return html`<oryx-checkout-shipping-method></oryx-checkout-shipping-method>`;
};

export const SingleProvider = Template.bind({});
