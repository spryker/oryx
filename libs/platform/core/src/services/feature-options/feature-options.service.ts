export const FeatureOptionsService = 'oryx.FeatureOptionsService';
export const FeatureOptions = 'oryx.FeatureOptions*';

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
