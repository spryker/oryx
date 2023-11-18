import { Provider } from '@spryker-oryx/di';
import {
  NetworkStateDefaultService,
  NetworkStateService,
} from '@spryker-oryx/offline';
import { PickingHeaderService } from '@spryker-oryx/picking';
import { PickingSyncActionHandlerService } from '@spryker-oryx/picking/offline';
import { PickingListService } from '@spryker-oryx/picking/services';
import { MockPickingHeaderService } from './mock-picking-header.service';
import { MockPickingListService } from './mock-picking-list.service';
import { MockPickingSyncActionHandlerService } from './mock-sync-action-handler.service';

export const mockPickingListProviders: Provider[] = [
  {
    provide: PickingListService,
    useClass: MockPickingListService,
  },
  {
    provide: PickingHeaderService,
    useClass: MockPickingHeaderService,
  },
  {
    provide: PickingSyncActionHandlerService,
    useClass: MockPickingSyncActionHandlerService,
  },
  {
    provide: NetworkStateService,
    useClass: NetworkStateDefaultService,
  },
];
