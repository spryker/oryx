import { MockCheckoutDataService } from '@spryker-oryx/checkout/mocks';
import { resolve } from '@spryker-oryx/di';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';
import { Shipment, ShipmentMethod } from '../../src/models';
import { CheckoutDataService } from '../../src/services';

export default { title: `${storybookPrefix}/Shipment` } as Meta;

const mock: Partial<Shipment>[] = [
  {
    id: '1',
    carriers: [
      {
        name: 'Carrier 1',
        shipmentMethods: [
          {
            id: 'DHL',
            name: 'DHL',
            price: 495,
            deliveryTime: 1684568761694 + 86400000,
          },
          {
            name: 'DHL express',
            price: 395,
            deliveryTime: 1684568761694,
          },
          {
            name: 'UPC',
            price: 300,
            deliveryTime: 1684568761694 + 86400000 * 3,
          },
        ] as ShipmentMethod[],
      },
    ],
  },
];

const Template: Story = (): TemplateResult => {
  resolve<MockCheckoutDataService>(CheckoutDataService).setMock(mock);

  return html`<oryx-checkout-shipment></oryx-checkout-shipment>`;
};

export const Demo = Template.bind({});
