import { AppFeature, ComponentsInfo } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { provideLitRoutes } from '@spryker-oryx/router/lit';
import { PickingConfig, providePickingConfig } from './config.provider';
import {
  customerNoteComponent,
  customerNoteModalComponent,
  filterButtonComponent,
  filtersComponent,
  loginPageComponent,
  navigateBackComponent,
  pickingComponent,
  pickingInProgressModalComponent,
  pickingListItemComponent,
  pickingListsComponent,
  pickingListsHeaderComponent,
  pickingProductCardComponent,
  userProfileComponent,
} from './defs';
import { defaultPickingRoutes } from './routes';
import {
  PickingHttpDefaultService,
  PickingHttpService,
  PickingListAdapter,
  PickingListDefaultAdapter,
  PickingListDefaultService,
  PickingListService,
} from './services';

export const pickingComponents = [
  customerNoteComponent,
  customerNoteModalComponent,
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
      { provide: PickingListService, useClass: PickingListDefaultService },
      { provide: PickingListAdapter, useClass: PickingListDefaultAdapter },
      { provide: PickingHttpService, useClass: PickingHttpDefaultService },
    ];
  }
}
