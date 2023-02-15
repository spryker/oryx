import { InjectorOptions, Provider, Type } from '@spryker-oryx/di';
import { ComponentsInfo, ComponentsOptions } from '../components';
import { Resources } from '../resources';
import { Theme } from '../theme';

export const AppRef = 'oryx.AppRef';

declare global {
  interface InjectionTokensContractMap {
    [AppRef]: App;
  }
}

export interface ModularAppBuilderOptions {
  injector?: Omit<InjectorOptions, 'providers'>;
  components?: Partial<ComponentsOptions>;
}

export interface AppFeature {
  providers?: Provider[];
  components?: ComponentsInfo;
  options?: ModularAppBuilderOptions;
  plugins?: AppPlugin[];
  resources?: Resources;
  defaultOptions?: FeatureOptions;
}

export interface App {
  findPlugin<T extends AppPlugin>(nameOrType: string | Type<T>): T | undefined;
  requirePlugin<T extends AppPlugin>(nameOrType: string | Type<T>): T;
  registerPlugin(plugin: AppPlugin): void;
  whenReady(): Promise<App>;
  markReady(): void;
  destroy(): void;
}

export interface AppBuilder<T = ''> {
  with(plugin: AppPlugin | AppPlugin[]): Builder<T>;
  create(): Promise<App>;
}

export type Builder<T> = T extends string ? AppBuilder : T;

export interface AppBuilderWithModules
  extends AppBuilder<AppBuilderWithModules> {
  withComponents(components: ComponentsInfo): AppBuilderWithModules;
  withProviders(providers: Provider[]): AppBuilderWithModules;
  withFeature(feature: AppFeature | AppFeature[]): AppBuilderWithModules;
  withAppOptions(options: ModularAppBuilderOptions): AppBuilderWithModules;
  withTheme(theme: Theme | Theme[]): AppBuilderWithModules;
  withEnvironment(env: AppEnvironment): AppBuilderWithModules;
  withResources(resources: Resources): AppBuilderWithModules;
  withOptions(options: FeatureOptions): AppBuilderWithModules;
}

export interface AppPlugin {
  getName(): string;
  apply(app: App): void | Promise<void>;
  destroy?(app?: App): void;
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
