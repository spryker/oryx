import { Provider } from '@spryker-oryx/di';
import { RouteConfig } from './lit-router';

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
  routesRegistry?: LitRoutesRegistry | (() => LitRoutesRegistry)
): Provider[] {
  if (!routesRegistry) return [];

  const routesFactory =
    typeof routesRegistry === 'function'
      ? routesRegistry
      : () => routesRegistry;

  return [{ provide: LitRoutesRegistry, useFactory: routesFactory }];
}
