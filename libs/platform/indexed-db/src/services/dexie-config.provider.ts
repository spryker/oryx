import { Provider } from '@spryker-oryx/di';

export interface DexieIndexedDbConfig {
  dbName?: string;
  debug?: boolean;
}

export const DexieIndexedDbConfig = 'oryx.DexieIndexedDbConfig';

declare global {
  interface InjectionTokensContractMap {
    [DexieIndexedDbConfig]: DexieIndexedDbConfig | null;
  }
}

export function provideDexieConfig(config?: DexieIndexedDbConfig): Provider[] {
  if (!config) return [];

  return [{ provide: DexieIndexedDbConfig, useValue: config }];
}
