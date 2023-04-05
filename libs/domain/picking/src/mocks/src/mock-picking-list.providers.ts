import { Provider } from '@spryker-oryx/di';
import { PickingListService } from '@spryker-oryx/picking';
import { MockPickingListService } from './mock-picking-list.service';

export const mockPickingListProviders: Provider[] = [
  {
    provide: PickingListService,
    useClass: MockPickingListService,
  },
];
