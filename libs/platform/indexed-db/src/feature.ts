import { AppFeature } from '@spryker-oryx/core';
import { inject, Provider } from '@spryker-oryx/di';
import {
  IndexedDbEntities,
  provideIndexedDbEntities,
} from './entities.provider';
import {
  DexieIndexedDbConfig,
  DexieIndexedDbService,
  IndexedDbService,
  provideDexieConfig,
} from './services';

export interface IndexedDbFeatureConfig extends DexieIndexedDbConfig {
  entityTypes?: IndexedDbEntities;
}

export class IndexedDbFeature implements AppFeature {
  providers: Provider[];

  constructor(config?: IndexedDbFeatureConfig) {
    this.providers = this.getProviders(config);
  }

  protected getProviders(config?: IndexedDbFeatureConfig): Provider[] {
    return [
      { provide: DexieIndexedDbService, useClass: DexieIndexedDbService },
      {
        provide: IndexedDbService,
        useFactory: () => inject(DexieIndexedDbService),
      },
      ...provideDexieConfig(config),
      ...provideIndexedDbEntities(config?.entityTypes),
    ];
  }
}
