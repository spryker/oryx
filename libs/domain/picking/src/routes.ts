import { RouteConfig } from '@lit-labs/router';
import { html } from 'lit';
import { PickingListItem, PickingOrderItem, PickingProduct } from './models';

const pickingItem: PickingListItem = {
  numberOfNotPicked: 3,
  numberOfPicked: 0,
  quantity: 3,
  product: {
    id: '136_24425591',
    image:
      'https://images.icecat.biz/img/gallery_mediums/img_24425591_medium_1483525296_3275_9985.jpg',
    imageLarge: 'https://images.icecat.biz/img/norm/high/24425591-5275.jpg',
    productName: 'Acer Chromebook C730-C8T7',
    sku: '136_24425591',
    type: 'productV2',
  } as PickingProduct,
  orderItem: {
    amount: '10',
    name: 'Acer Chromebook C730-C8T7',
    quantity: 1,
    sku: '136_24425591',
    uuid: '468e6f4c-5455-52b9-86f1-4fb64e772e4d',
    idSalesOrderItem: 1,
  } as PickingOrderItem,
};

export const defaultPickingRoutes: RouteConfig[] = [
  {
    path: '/',
    render: () =>
      html`<oryx-picking-product-card
        mode-light
        .productItem=${pickingItem}
      ></oryx-picking-product-card>`,
  },
];
