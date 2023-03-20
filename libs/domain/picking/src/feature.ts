import { AppFeature, ComponentsInfo } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { provideLitRoutes } from '@spryker-oryx/router/lit';
import {
  pickingListCardComponent,
  pickingListListComponent,
  navigateBackComponent,
  customerNoteComponent
} from './components';
import { PickingConfig, providePickingConfig } from './config.provider';
import { defaultPickingRoutes } from './routes';
import {
  PickingHttpDefaultService,
  PickingHttpService,
  PickingListAdapter,
  PickingListDefaultAdapter,
  PickingListDefaultService,
  PickingListService,
} from './services';

export interface PickingFeatureConfig extends PickingConfig {
  noDefaultRoutes?: boolean;
}

export class PickingFeature implements AppFeature {
  providers: Provider[];
  components: ComponentsInfo;

  constructor(config?: PickingFeatureConfig) {
    this.providers = this.getProviders(config);
    this.components = this.getComponents();
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

  protected getComponents(): ComponentsInfo {
    return [
      pickingListCardComponent, 
      pickingListListComponent,
      navigateBackComponent,
      customerNoteComponent
    ];
  }
}
