import { Observable } from 'rxjs';

export const FeatureOptionsService = 'oryx.FeatureOptionsService';
export const FeatureOptions = 'oryx.FeatureOptions*';

declare global {
  export interface FeatureOptions {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: Record<string, any> | undefined;
  }
}

export interface FeatureOptionsService {
  getFeatureOptions(
    name: string
  ): Observable<NonNullable<FeatureOptions[keyof FeatureOptions]>>;
  getOptions(): Observable<FeatureOptions>;
  addDefaultOptions(options: FeatureOptions): void;
}

declare global {
  interface InjectionTokensContractMap {
    [FeatureOptionsService]: FeatureOptionsService;
    [FeatureOptions]: FeatureOptions;
  }
}
