import { Provider } from '@spryker-oryx/di';
import { Component } from '@spryker-oryx/experience';

export const ExperienceStaticData = 'oryx.ExperienceStaticData*';
export const ExperienceDataService = 'oryx.ExperienceDataService';

export const enum ExperienceDataMergeType {
  Before = 'before',
  After = 'after',
  Replace = 'replace',
  Patch = 'patch',
}

type ExperienceDataMergeTypes = {
  [K in ExperienceDataMergeType]?: string;
};

export interface ExperienceDataMergeStrategy extends ExperienceDataMergeTypes {
  id: string;
}

export type StaticComponent = Omit<
  Component<unknown>,
  'id' | 'components' | 'type'
> & {
  id?: string;
  type?: string;
  components?: StaticComponent[];
  strategy?: ExperienceDataMergeStrategy;
};

export interface ExperienceDataService {
  getData(): StaticComponent[];
}

export interface ExperienceStaticData {
  data: StaticComponent | StaticComponent[];
  strategy?: ExperienceDataMergeStrategy;
}

export function provideExperienceData(
  data: StaticComponent | StaticComponent[]
): Provider {
  return {
    provide: ExperienceStaticData,
    useValue: data,
  };
}

declare global {
  interface InjectionTokensContractMap {
    [ExperienceStaticData]: StaticComponent | StaticComponent[];
    [ExperienceDataService]: ExperienceDataService;
  }
}
