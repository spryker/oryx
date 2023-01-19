import { Observable } from 'rxjs';

export const FeatureOptionsService = 'oryx.FeatureOptionsService';
export const FeatureOptions = 'oryx.FeatureOptions*';

declare global {
  export interface FeatureOptions {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: Record<string, any> | undefined;
  }
}

export const enum OptionsMergeStrategies {
  Prepend = 'prepend',
  Append = 'append',
}

export interface FeatureOptionsService {
  getComponentOptions(
    name: string
  ): Observable<FeatureOptions[keyof FeatureOptions]>;
  getOptions(): FeatureOptions;
  mergeOptions(
    options: FeatureOptions,
    strategy?: OptionsMergeStrategies
  ): void;
}

declare global {
  interface InjectionTokensContractMap {
    [FeatureOptionsService]: FeatureOptionsService;
    [FeatureOptions]: FeatureOptions;
  }
}
