import { Observable } from 'rxjs';

export const HydrationService = 'oryx.HydrationService';
export const HydrationTrigger = 'oryx.HydrationTrigger*';

export interface HydrationService {
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
