import { Injector } from '@spryker-oryx/di';
import { Observable } from 'rxjs';

export const HydrateService = 'oryx.HydrateService';
export const HydrateInitializer = 'oryx.HydrateInitializer*';

export interface HydrateService {
  hydrateOnDemand(element: HTMLElement, skipMissMatch?: boolean): Promise<void>;
  initHydrateHooks(immediate?: boolean): void;
}

export type HydrateInitializer = (
  service: HydrateService,
  injector: Injector
) => Observable<unknown>;

declare global {
  interface InjectionTokensContractMap {
    [HydrateService]: HydrateService;
    [HydrateInitializer]: HydrateInitializer;
  }
}
