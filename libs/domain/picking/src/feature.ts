import { Provider } from '@spryker-oryx/di';
import { DefaultLocaleAdapter, LocaleAdapter } from '@spryker-oryx/i18n';
import { PickingServicesFeature } from '@spryker-oryx/picking/services';
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
import { PickingHeaderDefaultService, PickingHeaderService } from './services';

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

export class PickingFeature extends PickingServicesFeature {
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
      //override SapiLocaleAdapter that is provided by siteFeature with default one
      //to eliminate unnecessary request to the store endpoint
      //was implemented in https://spryker.atlassian.net/browse/HRZ-89955
      {
        provide: LocaleAdapter,
        useClass: DefaultLocaleAdapter,
      },
      ...super.getProviders(),
    ];
  }
}
