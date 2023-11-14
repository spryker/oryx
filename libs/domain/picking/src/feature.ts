import {
  AppFeature,
  DefaultJsonAPITransformerService,
  JsonAPITransformerService,
} from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { provideLitRoutes } from '@spryker-oryx/router/lit';
import { ComponentsInfo } from '@spryker-oryx/utilities';
import {
  pickingCustomerNoteComponent,
  pickingCustomerNoteModalComponent,
  pickingDiscardModalComponent,
  pickingFilterButtonComponent,
  pickingFiltersComponent,
  pickingHeaderComponent,
  pickingInProgressModalComponent,
  pickingListItemComponent,
  pickingListsComponent,
  pickingListsHeaderComponent,
  pickingPickerComponent,
  pickingPickerHeaderComponent,
  pickingProductCardComponent,
  pickingUserProfileComponent,
  pickingWarehouseAssignmentComponent,
} from './components';
import { PickingConfig, providePickingConfig } from './config.provider';
import { defaultPickingRoutes } from './routes';
import {
  PickingHeaderDefaultService,
  PickingHeaderService,
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

export const pickingComponents = [
  pickingCustomerNoteComponent,
  pickingCustomerNoteModalComponent,
  pickingDiscardModalComponent,
  pickingFilterButtonComponent,
  pickingFiltersComponent,
  pickingHeaderComponent,
  pickingListsComponent,
  pickingListsHeaderComponent,
  pickingListItemComponent,
  pickingProductCardComponent,
  pickingInProgressModalComponent,
  pickingPickerComponent,
  pickingUserProfileComponent,
  pickingPickerHeaderComponent,
  pickingWarehouseAssignmentComponent,
];

export interface PickingFeatureConfig extends PickingConfig {
  noDefaultRoutes?: boolean;
}

export class PickingFeature implements AppFeature {
  providers: Provider[];
  components: ComponentsInfo;

  constructor(config?: PickingFeatureConfig) {
    this.providers = this.getProviders(config);
    this.components = pickingComponents;
  }

  protected getProviders(config?: PickingFeatureConfig): Provider[] {
    return [
      ...provideLitRoutes(
        !config?.noDefaultRoutes ? { routes: defaultPickingRoutes } : undefined
      ),
      ...providePickingConfig(config),
      {
        provide: JsonAPITransformerService,
        useClass: DefaultJsonAPITransformerService,
      },
      ...warehouseUserAssignmentNormalizer,
      ...warehouseUserAssignmentsNormalizer,
      { provide: PickingListService, useClass: PickingListDefaultService },
      { provide: PickingListAdapter, useClass: PickingListDefaultAdapter },
      { provide: PickingHttpService, useClass: PickingHttpDefaultService },
      { provide: PickingHeaderService, useClass: PickingHeaderDefaultService },
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
