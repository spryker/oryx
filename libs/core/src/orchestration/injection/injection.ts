import { AppPluginBeforeApply } from '@spryker-oryx/core';
import {
  createInjector,
  destroyInjector,
  Injector,
  InjectorOptions,
  Provider,
} from '@spryker-oryx/injector';
import { App, AppPlugin, AppRef } from '../app';

export const InjectionPluginName = 'core$injection';

/**
 * Plugin for creating injectors and adding providers to them.
 */
export class InjectionPlugin implements AppPlugin, AppPluginBeforeApply {
  protected injector?: Injector;

  constructor(
    protected providers: Provider[],
    protected readonly options?: Omit<InjectorOptions, 'providers'>
  ) {}

  getName(): string {
    return InjectionPluginName;
  }

  beforeApply(app: App): void | Promise<void> {
    this.injector = createInjector({
      ...this.options,
      providers: [...this.providers, { provide: AppRef, useValue: app }],
    });
  }

  apply(): void | Promise<void> {
    // Injector created in AppPluginBeforeApply
  }

  provide(provider: Provider): void {
    this.getInjector().provide(provider);
  }

  getInjector(): Injector {
    // Injector is created before anyone can call this method
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.injector!;
  }

  destroy(): void {
    destroyInjector(this.options?.context ?? '');
  }
}
