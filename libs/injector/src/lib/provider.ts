import { createInjector, destroyInjector } from './get-injector';

export type Provider = ClassProvider | ValueProvider | FactoryProvider;

export interface ClassProvider {
  provide: any;
  useClass: any;
}

export interface ValueProvider {
  provide: any;
  useValue: any;
}

export interface FactoryProvider {
  provide: any;
  useFactory: () => any;
}

export const setUpMockProviders = (
  ...providerList: Array<Provider[]>
): (() => void) => {
  return (): void => {
    destroyInjector();
    createInjector({
      providers: providerList.reduce(
        (providerList, providers) => [...providerList, ...providers],
        []
      ),
    });
  };
};
