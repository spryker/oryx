import {
  PickingListEntity,
  PickingListOffline,
} from '@spryker-oryx/picking/offline';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Decorators test`,
  parameters: { chromatic: { disableSnapshot: true } },
} as Meta;

const Template: Story = (): TemplateResult => {
  const testOfflineData = {
    items: [
      {
        productId: 'test',
        product: {
          id: 'test',
          sku: 'test',
          productName: 'test',
          image: null,
          imageLarge: null,
        },
      },
    ],
    itemsCount: 1,
    orderReferences: ['test'],
    productSkus: ['test'],
    requestedDeliveryDate: new Date(),
    localStatus: 'test',
    id: 'test',
    status: 'test',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const entity = new PickingListEntity(testOfflineData as PickingListOffline);
  return html` ${JSON.stringify(entity)} `;
};

export const Demo = Template.bind({});
