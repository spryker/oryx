import { CheckoutDataService, Shipment } from '@spryker-oryx/checkout';
import { MockCheckoutDataService } from '@spryker-oryx/checkout/mocks';
import { resolve } from '@spryker-oryx/di';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { mockShipments } from '../../../src/mocks/src/mock';

export default { title: `${storybookPrefix}/Shipment/Static` } as Meta;

const mock: Partial<Shipment>[] = [
  {
    id: '1',
    carriers: [
      {
        shipmentMethods: [mockShipments[0]],
      },
    ],
  },
];

const Template: Story = (): TemplateResult => {
  resolve<MockCheckoutDataService>(CheckoutDataService).setMock({
    shipments: mock,
  });

  return html`<oryx-checkout-shipping-method></oryx-checkout-shipping-method>`;
};

export const SingleMethod = Template.bind({});
