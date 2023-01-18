import { Observable } from 'rxjs';

export const FeatureFlagsService = 'oryx.FeatureFlagsService';
export const FeatureFlags = 'oryx.FeatureFlags*';

export interface Flags {
  [key: string]: Record<string, unknown>;
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
