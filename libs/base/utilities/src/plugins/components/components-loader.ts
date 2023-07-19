import { isDefined } from '../../guards';
import { resolveLazyLoadable } from '../utilities';
import {
  ComponentDef,
  ComponentImplMeta,
  ComponentInfo,
  ComponentMap,
  ComponentsOptions,
  ComponentStatic,
  ComponentType,
} from './components.model';
import {
  componentExtender,
  ComponentsPluginError,
  isComponentImplStrategy,
} from './utilities';

type ComponentExtender = (mapper: ComponentMap, name: string) => void;
type ComponentResolvers = Record<
  string,
  (componentDef: ComponentDef) => Promise<unknown>
>;

export class ComponentsLoader {
  protected readonly componentDefMap = new Map<string, ComponentDef>();
  protected readonly implMetaPreload: ComponentImplMeta = {};
  protected readonly componentMap = new Map<string, ComponentMap>();
  protected readonly logger = this.options?.logger ?? console;
  protected extenders: ComponentExtender[] = [];
  protected resolvers: ComponentResolvers = {};

  constructor(protected options: ComponentsOptions) {}

  protected async loadComponentImpl(
    def: ComponentDef,
    meta: ComponentImplMeta
  ): Promise<ComponentType | undefined> {
    const { impl } = def;

    if (isComponentImplStrategy(impl)) {
      return await impl.load(def, meta);
    } else {
      return await resolveLazyLoadable(impl);
    }
  }

  protected findComponentDefBy(name: string): ComponentDef {
    if (!this.componentDefMap.has(name)) {
      throw new ComponentsPluginError(`Component '${name}' is not registered!`);
    }

    // ComponentDef is checked above
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.componentDefMap.get(name)!;
  }

  protected processDef(info: ComponentInfo): ComponentDef {
    const def = typeof info === 'function' ? info() : info;

    return { ...def, name: this.processName(def.name) };
  }

  protected processName(name: string): string {
    return name.toLowerCase();
  }

  protected async preloadComponents(): Promise<void> {
    const preloaded = await Promise.all(
      Array.from(this.componentDefMap.values()).map((def) =>
        this.maybeLoadComponentImplStrategy(def, this.implMetaPreload)
      )
    );

    preloaded.filter(isDefined).map((def) => this.useComponent(def.name));
  }

  protected async tryLoadAndDefineComponent(
    name: string,
    meta: ComponentImplMeta
  ): Promise<ComponentType | undefined> {
    try {
      return await this.loadAndDefineComponent(name, meta);
    } catch {
      // That's okay, we tried
      return;
    }
  }

  protected async loadAndDefineComponent(
    name: string,
    meta: ComponentImplMeta
  ): Promise<ComponentType | undefined> {
    const def = this.findComponentDefBy(name);
    const extendedClass = await this.loadComponentDef(def, meta);

    // If component not yet loaded - skip definition
    if (!extendedClass) {
      return;
    }

    this.useComponent(name, true);

    return extendedClass;
  }

  protected useComponent(name: string, noWarn = false): void {
    const existingType = customElements.get(name);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { extendedClass } = this.componentMap.get(name)!;

    if (existingType) {
      if (!noWarn) {
        this.logger.warn(
          `Component '${name}' already defined as '${
            existingType.name
          }', skipping definition of '${
            Object.getPrototypeOf(extendedClass).name
          }'!`
        );
      }

      return;
    }

    for (const extender of this.extenders) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      extender(this.componentMap.get(name)!, name);
    }

    customElements.define(name, extendedClass, this.options.elementOptions);
  }

  /**
   * Extends component implementation before defining.
   */
  extendComponent(cb: ComponentExtender): void {
    this.extenders.push(cb);
  }

  /**
   * Adds callback which will be resolved together with component
   */
  setResolver(
    resolver: Record<string, (def: ComponentDef) => Promise<unknown>>
  ): void {
    this.resolvers = { ...this.resolvers, ...resolver };
  }

  /**
   * Checks if component has a strategy and loads it. Mostly used for preloading the component.
   */
  protected async maybeLoadComponentImplStrategy(
    def: ComponentDef,
    meta: ComponentImplMeta
  ): Promise<ComponentDef | undefined> {
    if (!isComponentImplStrategy(def.impl) && !this.options.preload) {
      return;
    }

    const componentDef = await this.loadComponentDef(def, meta);

    return componentDef ? def : undefined;
  }

  protected async loadComponentDef(
    def: ComponentDef,
    meta: ComponentImplMeta
  ): Promise<ComponentType | void> {
    if (this.componentMap.has(def.name)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.componentMap.get(def.name)!.extendedClass;
    }

    const resolversEntries = Object.entries(this.resolvers);
    const resolved = await Promise.all([
      this.loadComponentImpl(def, meta),
      ...resolversEntries.map(([_, cb]) => cb(def)),
    ]);
    const { componentClass, ...restResolvers } = resolved.reduce(
      (acc: ComponentMap, value, index) => {
        if (index === 0) {
          acc.componentClass = value as ComponentType;
        } else {
          acc[resolversEntries[index - 1][0]] = value;
        }

        return acc;
      },
      {} as ComponentMap
    ) as ComponentMap;

    if (!componentClass) {
      return;
    }

    const extendedClass = componentExtender(componentClass, def.name);

    this.componentMap.set(def.name, {
      ...restResolvers,
      extendedClass,
    });

    return extendedClass;
  }

  getComponentClass(tag: string): (ComponentType & ComponentStatic) | void {
    const component = this.componentMap.get(tag);

    if (component) {
      return Object.getPrototypeOf(component.extendedClass);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getComponentSchemas(): Promise<Record<string, any>[]> {
    const schemas = await Promise.all(
      [...(this.componentDefMap.values() ?? [])].map((component) =>
        resolveLazyLoadable(component.schema)
      )
    );

    return [...(this.componentDefMap.values() ?? [])].reduce(
      (data, component, index) =>
        schemas[index]
          ? [...data, { ...schemas[index], type: component.name }]
          : data,
      [] as Record<string, unknown>[]
    );
  }
}
