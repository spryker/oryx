import { Provider } from '@spryker-oryx/di';
import { WarehouseUserAssignmentsService } from '@spryker-oryx/picking/api';
import { MockWarehouseUserAssignmentsService } from './mock-warehouse-user-assignments.service';

export const mockWarehouseUserAssignmentsProviders: Provider[] = [
  {
    provide: WarehouseUserAssignmentsService,
    useClass: MockWarehouseUserAssignmentsService,
  },
];
