export const HydrateService = 'oryx.HydrateService';

export interface HydrateService {
  hydrateOnDemand(element: HTMLElement, skipMissMatch?: boolean): Promise<void>;
  initHydrateHooks(): void;
}

declare global {
  interface InjectionTokensContractMap {
    [HydrateService]: HydrateService;
  }
}
