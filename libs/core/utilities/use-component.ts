import {
  ComponentDef,
  ComponentDefImpl,
  ComponentInfo,
  ComponentStatic,
  ComponentType,
  ThemeStrategies,
} from '@spryker-oryx/core';
import { CSSResult, unsafeCSS } from 'lit';

/**
 * Defines and loads web-component by component definition(s).
 * Use mostly for storybooks and unit-tests for other cases use orchestration instead.
 */
export async function useComponent(
  componentDefFn: ComponentInfo | ComponentInfo[]
): Promise<void> {
  const isDef = (def: ComponentInfo): def is ComponentDef =>
    !!(def as ComponentDef).name;
  const componentDefFnArr = Array.isArray(componentDefFn)
    ? componentDefFn
    : [componentDefFn];
  const resolve = async <T>(impl: T | (() => Promise<T>)): Promise<T> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return await (impl as any)();
    } catch {
      return impl as T;
    }
  };
  const resolveComponent = async (
    impl: ComponentDefImpl
  ): Promise<ComponentType & ComponentStatic> => {
    if (typeof impl === 'object') {
      return (await impl.load({} as ComponentDef, {})) as ComponentType;
    }
    return await resolve(impl);
  };
  const transformer = (theme: CSSResult[] | string): CSSResult[] =>
    Array.isArray(theme) ? theme : [unsafeCSS(theme)];

  for (const componentDef of componentDefFnArr) {
    const {
      name,
      impl,
      theme: themeImpl,
    } = isDef(componentDef) ? componentDef : componentDef();

    if (customElements.get(name)) {
      continue;
    }

    const [component, theme] = await Promise.all([
      resolveComponent(impl),
      resolve(themeImpl),
    ]);

    if (theme) {
      let innerTheme = (component as { styles?: CSSResult[] }).styles ?? [];

      if (theme.strategy === ThemeStrategies.ReplaceAll) {
        innerTheme = transformer(theme.styles);
      }

      if (theme.strategy === ThemeStrategies.Replace || !theme.strategy) {
        innerTheme = [
          ...(Array.isArray(innerTheme) ? innerTheme : [innerTheme]),
          ...transformer(theme.styles),
        ];
      }

      component.styles = innerTheme;

      // eslint-disable-next-line no-prototype-builtins
      if (component.hasOwnProperty('finalized')) {
        component.elementStyles = component.finalizeStyles?.(component.styles);
      }
    }

    customElements.define(name, component);
  }
}
