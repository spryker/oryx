import { PickingListAdapter } from '@spryker-oryx/picking';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PickingListOnlineAdapter extends PickingListAdapter {}

export const PickingListOnlineAdapter = 'oryx.PickingListOnlineAdapter';

declare global {
  interface InjectionTokensContractMap {
    [PickingListOnlineAdapter]: PickingListOnlineAdapter;
  }
}
