/* eslint-disable @typescript-eslint/no-explicit-any */
import { LazyLoadable } from '@spryker-oryx/core/utilities';
import { Type } from '@spryker-oryx/utilities';
import { CSSResult, CSSResultGroup, CSSResultOrNative } from 'lit';

export type ComponentInfo = ComponentDef | ComponentDefFn;

export type ComponentsInfo = (ComponentInfo | ComponentInfo[])[];

export interface ComponentDef {
  readonly name: string;
  readonly impl: ComponentDefImpl;
  readonly options?: FeatureOptions[keyof FeatureOptions];
  readonly schema?: LazyLoadable<Type<unknown> | Record<string, any>>;
  readonly [key: string]: any;
}

export type ComponentDefFn = () => ComponentDef;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Component extends HTMLElement {}

export type ComponentType = Type<Component>;

export type ObservableType = Type<ObservableShadowElement> & ComponentStatic;

export interface ComponentStatic {
  styles?: CSSResult[];
  elementStyles?: CSSResultOrNative[];
  finalized?: boolean;
  finalizeStyles?(styles?: CSSResultGroup): CSSResultOrNative[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ComponentStaticSchema {}

export type ComponentDefImpl =
  | LazyLoadable<ComponentType>
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

export interface ComponentsOptions {
  root: ComponentInfo | string;
  elementOptions?: ElementDefinitionOptions;
  logger?: Pick<Console, 'warn'>;
  preload?: boolean;
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

export interface ComponentMap {
  componentClass?: ComponentType;
  extendedClass: ObservableType;
  [key: string]: unknown | undefined;
}

export interface ObservableShadowElement
  extends HTMLElement,
    ObservableShadow {}
