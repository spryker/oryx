import { Provider } from '@spryker-oryx/di';
import {
  PickingHeaderService,
  PickingListService,
} from '@spryker-oryx/picking';
import { PickingSyncActionHandlerService } from '@spryker-oryx/picking/offline';
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
];
