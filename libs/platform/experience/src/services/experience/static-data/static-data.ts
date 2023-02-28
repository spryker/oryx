import { Provider } from '@spryker-oryx/di';
import { Component } from '@spryker-oryx/experience';

export const ExperienceStaticData = 'oryx.ExperiencStaticData*';
export const ExperienceStaticService = 'oryx.ExperienceStaticService';

export type StaticComponent = Omit<Component<unknown>, 'id' | 'components'> & {
  id?: string;
  components?: StaticComponent[];
};

export interface ExperienceStaticService {
  getData(): Component[];
}

declare global {
  interface InjectionTokensContractMap {
    [ExperienceStaticData]: StaticComponent | StaticComponent[];
    [ExperienceStaticService]: ExperienceStaticService;
  }
}

export function provideExperienceData(
  data: StaticComponent | StaticComponent[]
): Provider {
  return {
    provide: ExperienceStaticData,
    useValue: data,
  };
}
