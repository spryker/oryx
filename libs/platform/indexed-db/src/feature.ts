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
  IndexedDbStorageStrategy,
  provideDexieConfig,
} from './services';
import { IndexedDbStorageStrategyToken } from './services/storage-strategy/indexed-db-storage-method';

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
        provide: IndexedDbStorageStrategyToken,
        useClass: IndexedDbStorageStrategy,
      },
      {
        provide: IndexedDbService,
        useFactory: () => inject(DexieIndexedDbService),
      },
      ...provideDexieConfig(config),
      ...provideIndexedDbEntities(config?.entityTypes),
    ];
  }
}
