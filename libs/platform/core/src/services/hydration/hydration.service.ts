import { Observable } from 'rxjs';
import { AppInitializer } from '../app-initializer';

export const HydrationService = 'oryx.HydrationService';
export const HydrationTrigger = 'oryx.HydrationTrigger*';

export interface HydrationService extends AppInitializer {
  hydrateOnDemand(element: HTMLElement, skipMissMatch?: boolean): Promise<void>;
  initHydrateHooks(immediate?: boolean): void;
}

export type HydrationTrigger = Observable<HTMLElement | unknown>;

declare global {
  interface InjectionTokensContractMap {
    [HydrationService]: HydrationService;
    [HydrationTrigger]: HydrationTrigger;
  }
}
