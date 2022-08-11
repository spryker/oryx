import {
  ComponentDef,
  ComponentDefFn,
  ComponentType,
} from '@spryker-oryx/core';

export async function useComponent(
  componentDefFn: ComponentDefFn | ComponentDefFn[]
): Promise<void> {
  const componentDefFnArr = Array.isArray(componentDefFn)
    ? componentDefFn
    : [componentDefFn];

  for (let i = 0; i < componentDefFnArr.length; i++) {
    const componentDef = componentDefFnArr[i]();
    const { name, impl } = componentDef;

    if (customElements.get(name)) {
      continue;
    }

    let component: ComponentType;

    if (typeof impl === 'object') {
      component = (await impl.load({} as ComponentDef, {})) as ComponentType;
    } else {
      try {
        // Try to call as a function
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component = await (impl as any)();
      } catch {
        // Otherwise use as a type
        component = impl as ComponentType;
      }
    }

    customElements.define(name, component);
  }
}
