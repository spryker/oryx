import { InferInjectType, setCurrentInjector } from './inject';
import {
  ClassProvider,
  FactoryProvider,
  Provider,
  ValueProvider,
} from './models/provider';

export const INJECTOR = 'oryx.Injector';

declare global {
  export interface InjectionTokensContractMap {
    [INJECTOR]: Injector;
  }
}

function isValueProvider(provider?: Provider): provider is ValueProvider {
  return (provider as ValueProvider)?.useValue !== undefined;
}

function isClassProvider(provider?: Provider): provider is ClassProvider {
  return (provider as ClassProvider)?.useClass !== undefined;
}

function isFactoryProvider(provider?: Provider): provider is FactoryProvider {
  return (provider as FactoryProvider)?.useFactory !== undefined;
}

interface ProviderMap {
  provider?: Provider;
  instance?: any;
}

/**
 * Injector container
 */
export class Injector {
  static readonly MultiProviderToken = '*';

  private providers = new Map<any, ProviderMap | undefined>();
  private _locked = false;
  private multiCounter = 0;

  constructor(providers: Provider[] = [], protected parent?: Injector) {
    for (const provider of providers) {
      this.provide(provider);
    }
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

    const token = this.isMultiProvider(provider.provide)
      ? `${provider.provide}ϴ${this.multiCounter++}`
      : provider.provide;
    this.providers.set(token, { provider });
  }

  /**
   *
   * @param token
   */
  inject<K extends keyof InjectionTokensContractMap>(
    token: K
  ): InferInjectType<K>;
  inject<K extends keyof InjectionTokensContractMap, L>(
    token: K,
    defaultInstance?: L
  ): InferInjectType<K> | L;
  inject<K>(token: K, defaultValue?: K): InferInjectType<K>;
  inject<K, L>(token: K, defaultValue?: L): InferInjectType<K> | L;
  inject<K = any>(token: string, defaultValue?: K): K;
  inject(token: any, defaultInstance?: any): any {
    if (token === INJECTOR) {
      return this;
    }

    this._locked = true;

    if (!this.providers.has(token) && this.isMultiProvider(token)) {
      this.setupMultiProvider(token);
    }

    if (!this.providers.get(token)) {
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
    this.providers.forEach((provider) => {
      provider?.instance?.onDestroy?.();
    });
  }

  protected getInstance(token: any): any {
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

  protected setupMultiProvider(token: string): void {
    const instance = [...this.providers.keys()]
      .filter((key) => typeof key === 'string' && key.startsWith(token))
      .map((key) => this.getInstance(key));

    if (instance.length) {
      this.providers.set(token, { instance });
    } else {
      // no providers for multi token, thus no multi provider in this injector
      this.providers.set(token, undefined);
    }
  }

  protected isMultiProvider(token: any): boolean {
    return (
      typeof token === 'string' && token.endsWith(Injector.MultiProviderToken)
    );
  }
}
