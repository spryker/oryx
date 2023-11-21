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
  pickingInProgressModalComponent,
  pickingListItemComponent,
  pickingListsComponent,
  pickingSearchComponent,
  pickingPickerComponent,
  pickingProductCardComponent,
  pickingUserProfileComponent,
  pickingWarehouseAssignmentComponent,
  pickingOrderReferenceComponent
} from './components';
import { PickingConfig, providePickingConfig } from './config.provider';
import { PickingListContextFallback } from './picking-list.context';
import { defaultPickingRoutes } from './routes';
import { PickingGuardDefaultService, PickingGuardService } from './services';

export const pickingComponents = [
  pickingCustomerNoteComponent,
  pickingCustomerNoteModalComponent,
  pickingDiscardModalComponent,
  pickingFilterButtonComponent,
  pickingFiltersComponent,
  pickingListsComponent,
  pickingSearchComponent,
  pickingListItemComponent,
  pickingProductCardComponent,
  pickingInProgressModalComponent,
  pickingPickerComponent,
  pickingUserProfileComponent,
  pickingWarehouseAssignmentComponent,
  pickingOrderReferenceComponent
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
        provide: PickingGuardService,
        useClass: PickingGuardDefaultService,
      },
      //override SapiLocaleAdapter that is provided by siteFeature with default one
      //to eliminate unnecessary request to the store endpoint
      //was implemented in https://spryker.atlassian.net/browse/HRZ-89955
      {
        provide: LocaleAdapter,
        useClass: DefaultLocaleAdapter,
      },
      PickingListContextFallback,
      ...super.getProviders(),
    ];
  }
}
