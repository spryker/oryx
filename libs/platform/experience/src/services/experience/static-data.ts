import { Provider } from '@spryker-oryx/di';
import { Component } from '@spryker-oryx/experience';

export const ExperienceStaticData = 'oryx.ExperiencStaticData*';

declare global {
  interface InjectionTokensContractMap {
    [ExperienceStaticData]: Component | Component[];
  }
}

export function provideExperienceData(data: Component | Component[]): Provider {
  return {
    provide: ExperienceStaticData,
    useValue: data,
  };
}
