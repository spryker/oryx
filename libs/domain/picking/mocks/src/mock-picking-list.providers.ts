import { Provider } from '@spryker-oryx/di';
import {
  NetworkStateDefaultService,
  NetworkStateService,
} from '@spryker-oryx/offline';
import { PickingGuardService } from '@spryker-oryx/picking';
import { PickingSyncActionHandlerService } from '@spryker-oryx/picking/offline';
import { PickingListService } from '@spryker-oryx/picking/services';
import { MockPickingGuardService } from './mock-picking-header.service';
import { MockPickingListService } from './mock-picking-list.service';
import { MockPickingSyncActionHandlerService } from './mock-sync-action-handler.service';

export const mockPickingListProviders: Provider[] = [
  {
    provide: PickingListService,
    useClass: MockPickingListService,
  },
  {
    provide: PickingGuardService,
    useClass: MockPickingGuardService,
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
