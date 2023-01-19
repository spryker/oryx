import { Observable } from 'rxjs';

export const FeatureFlagsService = 'oryx.FeatureFlagsService';
export const FeatureFlags = 'oryx.FeatureFlags*';

declare global {
  export interface Flags {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: Record<string, any> | undefined;
  }
}

export interface FeatureFlagsService {
  getComponentFlags(
    name: string,
    flags?: Flags
  ): Observable<Flags[keyof Flags]>;
  getFlags(): Flags;
}

declare global {
  interface InjectionTokensContractMap {
    [FeatureFlagsService]: FeatureFlagsService;
    [FeatureFlags]: Flags;
  }
}
