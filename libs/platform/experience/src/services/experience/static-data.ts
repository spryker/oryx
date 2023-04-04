import { Provider } from '@spryker-oryx/di';
import { Component } from '@spryker-oryx/experience';

export const ExperienceStaticData = 'oryx.ExperienceStaticData*';

export type StaticComponent = Omit<Component<unknown>, 'id' | 'components'> & {
  id?: string;
  components?: StaticComponent[];
};

declare global {
  interface InjectionTokensContractMap {
    [ExperienceStaticData]: StaticComponent | StaticComponent[];
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
