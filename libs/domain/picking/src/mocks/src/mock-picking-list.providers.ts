import { Provider } from '@spryker-oryx/di';
import {
  PickingHeaderDefaultService,
  PickingHeaderService,
  PickingListService,
} from '@spryker-oryx/picking';
import { MockPickingListService } from './mock-picking-list.service';

export const mockPickingListProviders: Provider[] = [
  {
    provide: PickingListService,
    useClass: MockPickingListService,
  },
  {
    provide: PickingHeaderService,
    useClass: PickingHeaderDefaultService,
  },
];
