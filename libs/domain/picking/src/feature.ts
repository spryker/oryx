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
  pickingLoginComponent,
  pickingPickerComponent,
  pickingPickerHeaderComponent,
  pickingProductCardComponent,
  pickingUserProfileComponent,
  pickingWarehouseAssignmentComponent,
} from './components';
import { PickingConfig, providePickingConfig } from './config.provider';
import { defaultPickingRoutes } from './routes';
import {
 PickingApiFeature
} from '@spryker-oryx/picking/api';
import {
  PickingHeaderDefaultService,
  PickingHeaderService,
} from './services';

export const pickingComponents = [
  pickingCustomerNoteComponent,
  pickingCustomerNoteModalComponent,
  pickingDiscardModalComponent,
  pickingFilterButtonComponent,
  pickingFiltersComponent,
  pickingLoginComponent,
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

export class PickingFeature extends PickingApiFeature {
  providers: Provider[];
  components: ComponentsInfo;

  constructor(config?: PickingFeatureConfig) {
    super();
    this.providers = this.getProviders(config);
    this.components = pickingComponents;
  }

  protected override getProviders(config?: PickingFeatureConfig): Provider[] {
    return [
      ...provideLitRoutes(
        !config?.noDefaultRoutes ? { routes: defaultPickingRoutes } : undefined
      ),
      ...providePickingConfig(config),
      {
        provide: PickingHeaderService,
        useClass: PickingHeaderDefaultService,
      },
      ...super.getProviders()
    ];
  }
}
