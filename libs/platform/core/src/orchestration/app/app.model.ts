import { Type } from '@spryker-oryx/di';

export const AppRef = 'oryx.AppRef';

declare global {
  interface InjectionTokensContractMap {
    [AppRef]: App;
  }
}

// TODO: move out to the experience package
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AppFeature {}

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
