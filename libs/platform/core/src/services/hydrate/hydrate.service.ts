import { Observable } from 'rxjs';

export const HydrateService = 'oryx.HydrateService';
export const HydrateInitializer = 'oryx.HydrateInitializer*';

export interface HydrateService {
  hydrateOnDemand(element: HTMLElement, skipMissMatch?: boolean): Promise<void>;
  initHydrateHooks(immediate?: boolean): void;
}

export type HydrateInitializer = Observable<HTMLElement | unknown>;

declare global {
  interface InjectionTokensContractMap {
    [HydrateService]: HydrateService;
    [HydrateInitializer]: HydrateInitializer;
  }
}
