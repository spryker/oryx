import { Provider } from '@spryker-oryx/di';
import { PickingListService } from '../../services/picking-list.service';
import { MockPickingListService } from './mock-picking-list.service';

export const mockPickingListProviders: Provider[] = [
  {
    provide: PickingListService,
    useClass: MockPickingListService,
  },
];
