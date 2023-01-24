import { RouteConfig } from '@lit-labs/router';
import { Provider } from '@spryker-oryx/di';

export interface LitRoutesRegistry {
  routes: RouteConfig[];
}

export const LitRoutesRegistry = 'oryx.LitRoutesRegistry*';

declare global {
  interface InjectionTokensContractMap {
    [LitRoutesRegistry]: LitRoutesRegistry;
  }
}

export function provideLitRoutes(
  routesRegistry?: LitRoutesRegistry
): Provider[] {
  if (!routesRegistry) {
    return [];
  }

  return [{ provide: LitRoutesRegistry, useValue: routesRegistry }];
}
