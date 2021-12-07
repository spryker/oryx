import { setCurrentInjector } from './inject';

export interface Provider {
  provide: any;
  useClass?: any;
  resolveClass?: () => Promise<any>;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface InjectionTokensContractMap {}
}

/**
 * Injector container
 */
export class Injector {
  private providers: Map<any, Provider & { instance?: any }>;
  private _locked = false;

  constructor(providers?: Provider[], protected parent?: Injector) {
    this.providers = new Map(
      providers?.map((provider) => [provider.provide, provider])
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
    this.providers.set(provider.provide, provider);
  }

  /**
   *
   * @param token
   */
  inject<K extends keyof InjectionTokensContractMap>(
    token: K,
    defaultInstance?: InjectionTokensContractMap[K]
  ): InjectionTokensContractMap[K];

  inject(token: any, defaultInstance?: any): any;
  inject<K extends keyof InjectionTokensContractMap>(
    token: K | any,
    defaultInstance: K | any
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

  private getInstance(token: any): any {
    const providerInstance = this.providers.get(token)!;

    if (providerInstance.instance === undefined) {
      const restoreInjector = setCurrentInjector(this);

      // eslint-disable-next-line new-cap
      providerInstance.instance = new providerInstance.useClass();
      restoreInjector();
    }

    return providerInstance.instance;
  }
}
