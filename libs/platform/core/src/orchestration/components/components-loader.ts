import { resolveLazyLoadable } from '@spryker-oryx/core/utilities';
import { Type } from '@spryker-oryx/di';
import { isDefined } from '@spryker-oryx/utilities';
import { ThemeData, ThemePlugin, ThemeStylesheets } from '../theme';
import {
  ComponentDef,
  ComponentImplMeta,
  ComponentInfo,
  ComponentsOptions,
  ComponentStatic,
  ComponentStaticSchema,
  ComponentType,
  ObservableType,
} from './components.model';
import {
  ComponentsPluginError,
  isComponentImplStrategy,
  observableShadow,
} from './utilities';

interface ComponentMap {
  observableType: ObservableType;
  componentType: ComponentType & ComponentStatic;
  themes?: (ThemeData | ThemeStylesheets)[] | null;
}

export interface ComponentSchemaData {
  schema: ((Type<unknown> & ComponentStaticSchema) | Record<string, any>)[];
  type: string;
}

export class ComponentsLoader {
  protected readonly componentDefMap = new Map<string, ComponentDef>();
  protected readonly implMetaPreload: ComponentImplMeta = {};
  protected readonly componentMap = new Map<string, ComponentMap>();
  public options: Partial<ComponentsOptions> = {};
  protected readonly logger = this.options?.logger ?? console;
  protected theme?: ThemePlugin;

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
    const observableType = await this.loadComponentDef(def, meta);

    // If component not yet loaded - skip definition
    if (!observableType) {
      return;
    }

    this.useComponent(name, true);

    return observableType;
  }

  protected useComponent(name: string, noWarn = false): void {
    const existingType = customElements.get(name);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { observableType, componentType } = this.componentMap.get(name)!;

    if (existingType) {
      if (!noWarn) {
        this.logger.warn(
          `Component '${name}' already defined as '${existingType.name}', skipping definition of '${componentType.name}'!`
        );
      }

      return;
    }

    this.extendComponent(name);
    customElements.define(name, observableType, this.options.elementOptions);
  }

  /**
   * Extends component implementation before defining.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected extendComponent(name: string): void {
    //
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
      return this.componentMap.get(def.name)!.observableType;
    }

    const [componentType, themes] = await Promise.all([
      this.loadComponentImpl(def, meta),
      this.theme?.resolve(def),
    ]);

    if (!componentType) {
      return;
    }

    const observableType = observableShadow(componentType, def.name);

    this.componentMap.set(def.name, {
      observableType,
      themes,
      componentType,
    });

    return observableType;
  }

  getComponentClass(
    tag: string
  ): (ComponentType & ComponentStatic) | undefined {
    return this.componentMap.get(tag)?.componentType;
  }

  async getComponentSchemas(): Promise<ComponentSchemaData[]> {
    const schemas = await Promise.all(
      [...(this.componentDefMap.values() ?? [])].map((component) =>
        resolveLazyLoadable(component.schema)
      ) as ComponentSchemaData['schema'][]
    );

    return [...(this.componentDefMap.values() ?? [])].reduce(
      (data, component, index) =>
        schemas[index]
          ? [...data, { schema: schemas[index], type: component.name }]
          : data,
      [] as ComponentSchemaData[]
    );
  }
}
