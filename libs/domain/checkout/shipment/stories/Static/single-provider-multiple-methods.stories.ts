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
        name: 'Mock Dummy Carrier',
        shipmentMethods: [mockShipments[0], mockShipments[1]],
      },
    ],
  },
];

const Template: Story = (): TemplateResult => {
  resolve<MockCheckoutDataService>(CheckoutDataService).setMock(mock);

  return html`<oryx-checkout-shipment></oryx-checkout-shipment>`;
};

export const SingleProviderMultipleMethods = Template.bind({});
