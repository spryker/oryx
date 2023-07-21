import { Provider } from '@spryker-oryx/di';
import { Component } from '@spryker-oryx/experience';

export const ExperienceData = 'oryx.ExperienceData*';
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

export type ExperienceComponent = Partial<
  Omit<Component<unknown>, 'components'>
> & {
  components?: ExperienceComponent[];
  strategy?: ExperienceDataMergeStrategy;
};

export interface ExperienceDataService {
  getData(): ExperienceComponent[];
}

export interface ExperienceData {
  data: ExperienceComponent | ExperienceComponent[];
  strategy?: ExperienceDataMergeStrategy;
}

export function provideExperienceData(
  data: ExperienceComponent | ExperienceComponent[]
): Provider {
  return {
    provide: ExperienceData,
    useValue: data,
  };
}

declare global {
  interface InjectionTokensContractMap {
    [ExperienceData]: ExperienceComponent | ExperienceComponent[];
    [ExperienceDataService]: ExperienceDataService;
  }
}
