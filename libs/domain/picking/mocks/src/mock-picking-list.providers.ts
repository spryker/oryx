import { Provider } from '@spryker-oryx/di';
import {
  PickingHeaderService,
  PickingListService,
} from '@spryker-oryx/picking';
import { MockPickingHeaderService } from './mock-picking-header.service';
import { MockPickingListService } from './mock-picking-list.service';

export const mockPickingListProviders: Provider[] = [
  {
    provide: PickingListService,
    useClass: MockPickingListService,
  },
  {
    provide: PickingHeaderService,
    useClass: MockPickingHeaderService,
  },
];
