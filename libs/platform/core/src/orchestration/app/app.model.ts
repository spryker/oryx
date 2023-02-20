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
  /** Find a plugin if available */
  findPlugin<T extends AppPlugin>(nameOrType: string | Type<T>): T | undefined;
  /** Require a plugin and throw if not available */
  requirePlugin<T extends AppPlugin>(nameOrType: string | Type<T>): T;
  /** Waits when the app is done initializing */
  whenReady(): Promise<App>;
  /** Destroy and cleanup the application */
  destroy(): void;
}

export interface AppBuilder {
  with(...plugins: AppPlugin[]): this;
  create(): Promise<App>;
}

export interface AppBuilderWithModules extends AppBuilder {
  withComponents(components: ComponentsInfo): this;
  withProviders(providers: Provider[]): this;
  withFeature(...features: AppFeature[] | AppFeature[][]): this;
  withAppOptions(options: ModularAppBuilderOptions): this;
  withTheme(theme: Theme | Theme[]): this;
  withEnvironment(env: AppEnvironment): this;
  withResources(resources: Resources): this;
  withOptions(options: FeatureOptions): this;
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
