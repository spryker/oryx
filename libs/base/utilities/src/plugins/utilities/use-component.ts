import {
  ComponentDef,
  ComponentDefImpl,
  ComponentInfo,
  ComponentType,
} from '../components';

const isDefGuard = (def: ComponentInfo): def is ComponentDef =>
  !!(def as ComponentDef).name;

const resolveComponent = async (
  impl: ComponentDefImpl
): Promise<ComponentType> => {
  if (typeof impl === 'object')
    return (await impl.load({} as ComponentDef, {})) as ComponentType;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await (impl as any)();
  } catch {
    return impl as ComponentType;
  }
};

/**
 * Defines and loads web-component by component definition(s).
 * Use mostly for unit-tests for other cases use orchestration instead.
 */
export async function useComponent(
  componentDefFn: ComponentInfo | ComponentInfo[]
): Promise<void> {
  const componentDefFnArr = Array.isArray(componentDefFn)
    ? componentDefFn
    : [componentDefFn];

  for (const componentDef of componentDefFnArr) {
    const { name, impl } = isDefGuard(componentDef)
      ? componentDef
      : componentDef();

    if (customElements.get(name)) continue;

    const component = await resolveComponent(impl);

    customElements.define(name, component);
  }
}
