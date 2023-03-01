import {
  createInjector,
  destroyInjector,
  Injector,
  InjectorOptions,
  Provider,
} from '@spryker-oryx/di';
import { App, AppPlugin, AppPluginBeforeApply, AppRef } from '../app';

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
    this.createInjector(app);
  }

  apply(): void | Promise<void> {
    // Injector created in AppPluginBeforeApply
  }

  getInjector(): Injector {
    // Injector is created before anyone can call this method
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.injector!;
  }

  createInjector(app: App): void {
    this.injector = createInjector({
      ...this.options,
      providers: [...this.providers, { provide: AppRef, useValue: app }],
    });
  }

  destroy(): void {
    this.injector = undefined;
    destroyInjector(this.options?.context ?? '');
  }
}
