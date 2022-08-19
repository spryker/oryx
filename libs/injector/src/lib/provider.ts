import { createInjector, destroyInjector } from './get-injector';
import { resolve } from './resolve';

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
  const checker = JSON.stringify(providerList);
  const token = 'MOCK_PROVIDERS';

  return (): void => {
    const providedValue = resolve(token, null);

    if (providedValue === checker) {
      return;
    }

    destroyInjector();
    createInjector({
      providers: providerList.reduce(
        (providerList, providers) => [
          ...providerList,
          ...providers,
          {
            provide: token,
            useValue: checker,
          },
        ],
        []
      ),
    });
  };
};
