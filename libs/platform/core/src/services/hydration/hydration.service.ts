import { OnDestroy } from '@spryker-oryx/di';
import { Observable } from 'rxjs';

export const HydrationService = 'oryx.HydrationService';
export const HydrationTrigger = 'oryx.HydrationTrigger*';

export interface HydrationService extends OnDestroy {
  hydrateOnDemand(element: HTMLElement): Promise<void>;
  initHydrateHooks(immediate?: boolean): void;
}

export type HydrationTrigger = Observable<HTMLElement | unknown>;

declare global {
  interface InjectionTokensContractMap {
    [HydrationService]: HydrationService;
    [HydrationTrigger]: HydrationTrigger;
  }
}
