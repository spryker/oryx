export const FeatureOptionsService = 'oryx.FeatureOptionsService';
export const FeatureOptions = 'oryx.FeatureOptions*';

declare global {
  export interface FeatureOptions {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: Record<string, any> | undefined;
  }
}

export interface FeatureOptionsService {
  getFeatureOptions<N extends keyof FeatureOptions>(name: N): FeatureOptions[N];
  getFeatureOptions(name: string): object;
}

declare global {
  interface InjectionTokensContractMap {
    [FeatureOptionsService]: FeatureOptionsService;
    [FeatureOptions]: FeatureOptions;
  }
}
