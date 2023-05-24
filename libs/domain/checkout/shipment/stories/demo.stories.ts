import { MockCheckoutDataService } from '@spryker-oryx/checkout/mocks';
import { resolve } from '@spryker-oryx/di';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';
import { mockCarriers } from '../../src/mocks/src/mock';
import { Shipment } from '../../src/models';
import { CheckoutDataService } from '../../src/services';

export default { title: `${storybookPrefix}/Shipment` } as Meta;

const mock: Partial<Shipment>[] = [
  {
    id: '1',
    carriers: mockCarriers,
  },
];

const Template: Story = (): TemplateResult => {
  resolve<MockCheckoutDataService>(CheckoutDataService).setMock({
    shipments: mock,
  });

  return html`<oryx-checkout-shipment></oryx-checkout-shipment>`;
};

export const Demo = Template.bind({});
