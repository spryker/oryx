import { PickingList, PickingListStatus } from '@spryker-oryx/picking';

export const mockPickingListData: PickingList[] = [
  {
    id: 'withCartNote',
    status: PickingListStatus.ReadyForPicking,
    createdAt: new Date(),
    updatedAt: new Date(),
    cartNote: 'Mock cart note',
    items: [],
  },
  {
    id: 'withoutCartNote',
    status: PickingListStatus.ReadyForPicking,
    createdAt: new Date(),
    updatedAt: new Date(),
    items: [],
  },
];
