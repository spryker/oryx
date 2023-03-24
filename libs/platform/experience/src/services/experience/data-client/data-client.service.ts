import { AppInitializer } from '@spryker-oryx/core';
import { StaticComponent } from '../static-data';

export const ExperienceDataClientService = 'oryx.ExperienceDataClientService';

export interface ExperienceDataClientService extends AppInitializer {
  sendStatic(data: StaticComponent[]): void;
}

declare global {
  interface InjectionTokensContractMap {
    [ExperienceDataClientService]: ExperienceDataClientService;
  }
}
