import { Provider } from '@spryker-oryx/di';

export const EntityProvider = 'oryx.EntityProvider*';

export interface EntityProvider<E = unknown, Q = unknown> {
  service: string;
  // factory?: () => E;
  context?: string;
  // contextToQualifier?: () => Q;
}

export function provideEntity(type: string, config: EntityProvider): Provider;
export function provideEntity(
  type: string,
  factory: () => EntityProvider
): Provider;
export function provideEntity(
  type: string,
  config: EntityProvider | (() => EntityProvider)
): Provider {
  const provide = `${EntityProvider}${type}`;
  return typeof config === 'function'
    ? { provide, useFactory: config }
    : {
        provide,
        useValue: config,
      };
}

declare global {
  interface InjectionTokensContractMap {
    [EntityProvider]: EntityProvider;
  }
}
