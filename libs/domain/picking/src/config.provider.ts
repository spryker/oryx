import { Provider } from '@spryker-oryx/di';

export interface PickingConfig {
  appVersion?: string;
}

export const PickingConfig = 'oryx.PickingConfig';

declare global {
  interface InjectionTokensContractMap {
    [PickingConfig]: PickingConfig;
  }
}

export function providePickingConfig(config?: PickingConfig): Provider[] {
  if (!config) return [];

  return [{ provide: PickingConfig, useValue: config }];
}
