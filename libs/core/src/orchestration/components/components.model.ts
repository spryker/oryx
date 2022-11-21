import { Type } from '@spryker-oryx/injector';
import { HOOKS_KEY } from '@spryker-oryx/utilities';
import { CSSResult, CSSResultGroup, CSSResultOrNative } from 'lit';
import { LazyLoadable, ThemeData, ThemeStylesheets } from '../theme';

export type ComponentInfo = ComponentDef | ComponentDefFn;

export type ComponentsInfo = (ComponentInfo | ComponentInfo[])[];

export interface ComponentTheme {
  theme?: string;
  rules: LazyLoadable<ThemeData | ThemeStylesheets>;
}

export interface ComponentDef {
  readonly name: string;
  readonly impl: ComponentDefImpl;
  readonly stylesheets?: ComponentTheme[];
}

export type ComponentDefFn = () => ComponentDef;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Component extends HTMLElement {}

export interface ComponentProps {
  [HOOKS_KEY]?: Record<string, string>;
}

export type ComponentType = Type<Component> & ComponentProps;

export type ObservableType = Type<ObservableShadowElement> &
  ComponentProps &
  ComponentStatic;

export interface ComponentStatic {
  styles?: CSSResult[];
  elementStyles?: CSSResultOrNative[];
  finalized?: boolean;
  finalizeStyles?(styles?: CSSResultGroup): CSSResultOrNative[];
}

export type ComponentDefImpl =
  | ComponentType
  | (() => Promise<ComponentType>)
  | ComponentImplStrategy;

export interface ComponentImplMeta {
  readonly foundInDom?: boolean;
  readonly programmaticLoad?: boolean;
}

export interface ComponentImplStrategy {
  load(
    def: ComponentDef,
    meta: ComponentImplMeta
  ): Promise<ComponentType | undefined>;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface HooksTokenMap {}
}

export interface ComponentsPluginOptions {
  root: ComponentInfo | string;
  elementOptions?: ElementDefinitionOptions;
  logger?: Pick<Console, 'warn'>;
  preload?: boolean;
  [HOOKS_KEY]?: HooksTokenMap;
}

export function componentDef(def: ComponentDef) {
  return <T = ComponentDef>(overrides?: Partial<T>): ComponentDef => ({
    ...def,
    ...overrides,
  });
}

export interface ObservableShadow {
  whenShadowAttached(): Promise<ShadowRoot>;
}

export interface ObservableShadowElement
  extends HTMLElement,
    ObservableShadow {}
