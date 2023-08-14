import { Provider } from '@spryker-oryx/di';
import { Component } from '@spryker-oryx/experience';

export const ExperienceData = 'oryx.ExperienceData*';
export const ExperienceDataService = 'oryx.ExperienceDataService';

export const enum ExperienceDataMergeType {
  Before = 'before',
  Prepend = 'prepend',
  Append = 'append',
  After = 'after',
  Replace = 'replace',
  Patch = 'patch',
  Remove = 'remove',
}

export const enum ExperienceDataType {
  Page = 'Page',
}

export interface ExperienceDataMergeStrategy {
  /**
   * Interpolates value by type\id path.
   * Value path should be separated by a dot. (e.g. headerId.oryx-composition.footerId).
   *
   * If first part starts with # symbol (#footer.oryx-composition) it means that we want to take specific template by if
   * if not than we change all templates.
   *
   * It's possible to use aliases
   *   nested chain - oryx-composition>3 => oryx-composition.oryx-composition.oryx-composition
   *   element index - oryx-composition[2] => get second oryx-composition element
   */
  selector: string;
  /**
   * @default ExperienceDataMergeType.Replace
   */
  type?: ExperienceDataMergeType | string;
}

export type ExperienceComponent = Partial<Omit<Component, 'components'>> & {
  components?: ExperienceComponent[];
  merge?: ExperienceDataMergeStrategy;
  ref?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string | symbol]: any;
};

export interface ExperienceDataService {
  getData(cb?: (c: ExperienceComponent) => void): ExperienceComponent[];
  getAutoId(): string;
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
