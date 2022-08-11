import { InjectorOptions, Provider } from '@spryker-oryx/injector';
import { Type } from '@spryker-oryx/typescript-utils';
import { ComponentsInfo, ComponentsPluginOptions } from './components';

export const AppRef = 'FES.AppRef';

declare global {
  interface InjectionTokensContractMap {
    [AppRef]: App;
  }
}

export interface ModularAppBuilderOptions {
  injector?: Omit<InjectorOptions, 'providers'>;
  components?: Partial<ComponentsPluginOptions>;
}

export interface App {
  findPlugin<T extends AppPlugin>(nameOrType: string | Type<T>): T | undefined;
  requirePlugin<T extends AppPlugin>(nameOrType: string | Type<T>): T;
  whenReady(): Promise<App>;
}

export interface AppBuilder<T = unknown> {
  with(plugin: AppPlugin): Builder<T>;
  create(): Promise<App>;
}

export type Builder<T> = T extends unknown ? AppBuilder : T;

export interface AppBuilderWithModules
  extends AppBuilder<AppBuilderWithModules> {
  withComponents(components: ComponentsInfo): AppBuilderWithModules;
  withProviders(providers: Provider[]): AppBuilderWithModules;
  withOptions(options: ModularAppBuilderOptions): AppBuilderWithModules;
}

export interface AppPlugin {
  getName(): string;
  apply(app: App): void | Promise<void>;
}

export interface AppPluginBeforeApply {
  beforeApply(app: App): void | Promise<void>;
}

export interface AppPluginAfterApply {
  afterApply(app: App): void | Promise<void>;
}

export function isAppPluginBeforeApply<T extends NonNullable<unknown>>(
  plugin: T
): plugin is T & AppPluginBeforeApply {
  return (
    typeof (plugin as unknown as AppPluginBeforeApply).beforeApply ===
    'function'
  );
}

export function isAppPluginAfterApply<T extends NonNullable<unknown>>(
  plugin: T
): plugin is T & AppPluginAfterApply {
  return (
    typeof (plugin as unknown as AppPluginAfterApply).afterApply === 'function'
  );
}
