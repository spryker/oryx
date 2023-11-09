import {
  AppFeature,
  DefaultJsonAPITransformerService,
  JsonAPITransformerService,
} from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import {
  PickingHttpDefaultService,
  PickingHttpService,
  PickingListAdapter,
  PickingListDefaultAdapter,
  PickingListDefaultService,
  PickingListService,
  WarehouseUserAssignmentsAdapter,
  WarehouseUserAssignmentsDefaultAdapter,
  WarehouseUserAssignmentsDefaultService,
  WarehouseUserAssignmentsService,
  warehouseUserAssignmentNormalizer,
  warehouseUserAssignmentsNormalizer,
} from './services';

export class PickingApiFeature implements AppFeature {
  providers = this.getProviders();
  
  protected getProviders(): Provider[] {
    return [
      {
        provide: JsonAPITransformerService,
        useClass: DefaultJsonAPITransformerService,
      },
      ...warehouseUserAssignmentNormalizer,
      ...warehouseUserAssignmentsNormalizer,
      { provide: PickingListService, useClass: PickingListDefaultService },
      { provide: PickingListAdapter, useClass: PickingListDefaultAdapter },
      { provide: PickingHttpService, useClass: PickingHttpDefaultService },
      {
        provide: WarehouseUserAssignmentsAdapter,
        useClass: WarehouseUserAssignmentsDefaultAdapter,
      },
      {
        provide: WarehouseUserAssignmentsService,
        useClass: WarehouseUserAssignmentsDefaultService,
      },
    ];
  }
}
