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

export const enum ExperienceRefPosition {
  Prepend = 'prepend',
  Append = 'append',
}

type ExperienceDataMergeTypes = {
  /**
   * Interpolates value by type\id path.
   * Value path should be separated by a dot. (e.g. headerId.oryx-composition.footerId).
   *
   * It's possible to use aliases
   *   nested chain - oryx-composition>3 => oryx-composition.oryx-composition.oryx-composition
   *   element index - oryx-composition[2] => get second oryx-composition element
   */
  [K in ExperienceDataMergeType]?: string;
};

export interface ExperienceDataMergeStrategy extends ExperienceDataMergeTypes {
  id: string;
}

export interface ExperienceDataRef {
  [key: string]: ExperienceRefPosition | string;
}

export type ExperienceComponent = Partial<
  Omit<Component<unknown>, 'components'>
> & {
  ref?: ExperienceDataRef;
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
