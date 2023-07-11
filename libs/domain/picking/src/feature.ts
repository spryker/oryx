import {
  AppFeature,
  ComponentsInfo,
  DefaultJsonAPITransformerService,
  JsonAPITransformerService,
} from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { provideLitRoutes } from '@spryker-oryx/router/lit';
import {
  customerNoteComponent,
  customerNoteModalComponent,
  discardModalComponent,
  filterButtonComponent,
  filtersComponent,
  loginPageComponent,
  navigateBackComponent,
  pickingComponent,
  pickingHeaderComponent,
  pickingInProgressModalComponent,
  pickingListItemComponent,
  pickingListsComponent,
  pickingListsHeaderComponent,
  pickingProductCardComponent,
  userProfileComponent,
  warehouseAssignmentComponent,
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
  warehouseUserAssignmentNormalizer,
  WarehouseUserAssignmentsAdapter,
  WarehouseUserAssignmentsDefaultAdapter,
  WarehouseUserAssignmentsDefaultService,
  warehouseUserAssignmentsNormalizer,
  WarehouseUserAssignmentsService,
} from './services';

export const pickingComponents = [
  customerNoteComponent,
  customerNoteModalComponent,
  discardModalComponent,
  filterButtonComponent,
  filtersComponent,
  loginPageComponent,
  navigateBackComponent,
  pickingListsComponent,
  pickingListsHeaderComponent,
  pickingListItemComponent,
  pickingProductCardComponent,
  pickingInProgressModalComponent,
  pickingComponent,
  userProfileComponent,
  pickingHeaderComponent,
  warehouseAssignmentComponent,
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
