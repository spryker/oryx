import {
  ItemsFilters,
  PickingList,
  PickingListStatus,
} from '@spryker-oryx/picking';

export const mockPickingListData: PickingList[] = [
  {
    id: 'withCartNote',
    status: PickingListStatus.ReadyForPicking,
    createdAt: new Date('2023-03-01'),
    updatedAt: new Date('2023-03-01'),
    cartNote: 'Mock cart note',
    items: [
      {
        numberOfNotPicked: 1,
        numberOfPicked: 1,
        quantity: 2,
        orderItem: {
          quantity: 2,
          amount: '2',
          idSalesOrderItem: 1,
          uuid: '1',
          name: 'name',
          sku: 'sku',
        },
        product: {
          productName: 'productName',
          id: '1',
          sku: '111',
          image: '/image/test.jpg',
          imageLarge: '',
        },
        status: ItemsFilters.NotPicked,
      },
    ],
  },
  {
    id: 'withoutCartNote',
    status: PickingListStatus.PickingStarted,
    createdAt: new Date('2023-03-01'),
    updatedAt: new Date('2023-03-01'),
    items: [
      {
        numberOfNotPicked: 1,
        numberOfPicked: 1,
        quantity: 2,
        orderItem: {
          quantity: 2,
          amount: '2',
          idSalesOrderItem: 1,
          uuid: '1',
          name: 'name',
          sku: 'sku',
        },
        product: {
          productName: 'productName',
          id: '1',
          sku: '111',
          image: '',
          imageLarge: '',
        },
        status: ItemsFilters.Picked,
      },
    ],
  },
];
