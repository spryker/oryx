import { setCurrentInjector } from './inject';
import {
  ClassProvider,
  FactoryProvider,
  Provider,
  ValueProvider,
} from './provider';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface InjectionTokensContractMap {}
}

function isValueProvider(provider: Provider): provider is ValueProvider {
  return (provider as ValueProvider).useValue !== undefined;
}

function isClassProvider(provider: Provider): provider is ClassProvider {
  return (provider as ClassProvider).useClass !== undefined;
}

function isFactoryProvider(provider: Provider): provider is FactoryProvider {
  return (provider as FactoryProvider).useFactory !== undefined;
}

/**
 * Injector container
 */
export class Injector {
  private providers: Map<any, { provider: Provider; instance?: any }>;
  private _locked = false;

  constructor(providers?: Provider[], protected parent?: Injector) {
    this.providers = new Map(
      providers?.map((provider) => [provider.provide, { provider }])
    );
  }

  /**
   * Register injection tokens with providers.
   *
   * Each subsequent provider replaces previous one.
   *
   * Providing is only possible before first injector usage (first injection).
   *
   * @param provider
   */
  provide(provider: Provider): void {
    if (this._locked) {
      throw new Error(`Providing is only possible before the first injection!`);
    }
    this.providers.set(provider.provide, { provider });
  }

  /**
   *
   * @param token
   */
  inject<K extends keyof InjectionTokensContractMap>(
    token: K,
    defaultInstance?: InjectionTokensContractMap[K]
  ): InjectionTokensContractMap[K];
  inject<K extends keyof InjectionTokensContractMap, L>(
    token: K,
    defaultInstance?: L
  ): InjectionTokensContractMap[K] | L;
  inject(token: any, defaultInstance?: any): any;
  inject<K extends keyof InjectionTokensContractMap>(
    token: K | any,
    defaultInstance?: K | any
  ): InjectionTokensContractMap[K] | any {
    this._locked = true;
    if (!this.providers.has(token)) {
      // no local provider
      if (this.parent) {
        return this.parent.inject(token, defaultInstance);
      }
      // use default instance provided
      if (defaultInstance !== undefined) {
        return defaultInstance;
      }
      throw new Error(`No provider for token ${token}!!!`);
    }

    return this.getInstance(token);
  }

  destroy(): void {
    this.providers.forEach(({ instance }) => {
      instance?.onDestroy?.();
    });
  }

  private getInstance(token: any): any {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const providerInstance = this.providers.get(token)!;

    if (isValueProvider(providerInstance.provider)) {
      return providerInstance.provider.useValue;
    }

    if (providerInstance.instance === undefined) {
      const restoreInjector = setCurrentInjector(this);

      if (isClassProvider(providerInstance.provider)) {
        // eslint-disable-next-line new-cap
        providerInstance.instance = new providerInstance.provider.useClass();
      } else if (isFactoryProvider(providerInstance.provider)) {
        providerInstance.instance = providerInstance.provider.useFactory();
      } else {
        throw new Error(`Invalid provider for ${token}`);
      }

      restoreInjector();
    }

    return providerInstance.instance;
  }
}
