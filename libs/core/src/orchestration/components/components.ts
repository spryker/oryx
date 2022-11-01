import { isNodeElement } from '@spryker-oryx/core/utilities';
import { HOOKS_KEY, isDefined } from '@spryker-oryx/utilities';
import { App, AppPlugin } from '../app';
import { ThemeData, ThemePlugin, ThemeStrategies } from '../theme';
import {
  ComponentDef,
  ComponentDefImpl,
  ComponentImplMeta,
  ComponentImplStrategy,
  ComponentInfo,
  ComponentsInfo,
  ComponentsPluginOptions,
  ComponentStatic,
  ComponentType,
  ObservableShadowElement,
  ObservableType,
} from './components.model';
import {
  isObservableShadowElement,
  observableShadow,
} from './observable-shadow';

interface ComponentMap {
  observableType: ObservableType;
  componentType: ComponentType & ComponentStatic;
  themes?: ThemeData[] | null;
}

export const ComponentsPluginName = 'core$components';

/**
 *  Registers, loads and defines components. Observes nodes (including shadowDOM).
 *  Defines components in lazy-load and preload modes, depends on options {@link ComponentsPluginOptions}.
 *  Redefines component static method by {@link HOOKS_KEY}.
 *  Applies theme styles for component definition.
 */
export class ComponentsPlugin implements AppPlugin {
  protected readonly componentDefMap = new Map<string, ComponentDef>();
  protected readonly logger = this.options?.logger ?? console;
  protected readonly componentMap = new Map<string, ComponentMap>();
  protected readonly observer = new MutationObserver(
    this.handleMutations.bind(this)
  );
  protected readonly implMetaPreload: ComponentImplMeta = {};
  protected readonly implMetaInDom: ComponentImplMeta = { foundInDom: true };
  protected readonly implMetaProgrammatic: ComponentImplMeta = {
    programmaticLoad: true,
  };
  protected theme?: ThemePlugin;
  rootSelector = '';

  constructor(
    componentsInfo: ComponentsInfo,
    public options: ComponentsPluginOptions
  ) {
    this.registerComponents(componentsInfo);
  }

  getName(): string {
    return ComponentsPluginName;
  }

  async apply(app: App): Promise<void> {
    this.theme = app.findPlugin(ThemePlugin);

    this.rootSelector =
      typeof this.options.root === 'string'
        ? this.options.root
        : this.processDef(this.options.root).name;

    if (this.options.preload) {
      await this.preloadComponents();

      return;
    }

    const rootElement = document.querySelector?.(this.rootSelector);

    if (!rootElement) {
      throw new ComponentsPluginError(
        `Cannot find root element by selector '${this.rootSelector}'!`
      );
    }

    await this.preloadComponents();

    this.observe(rootElement);
  }

  destroy(): void {
    this.observer.disconnect();
  }

  registerComponents(componentsInfo: ComponentsInfo): void {
    componentsInfo.flat().forEach((info) => {
      const def = this.processDef(info);
      this.componentDefMap.set(def.name, def);
    });
  }

  async loadComponent(name: string): Promise<ComponentType | undefined> {
    return this.loadAndDefineComponent(name, this.implMetaProgrammatic);
  }

  protected observe(element: Node): void {
    this.observer.observe(element, {
      subtree: true,
      childList: true,
      attributes: false,
      characterData: false,
    });

    // Start first check immediately
    this.checkNode(element);
  }

  protected handleMutations(mutations: MutationRecord[]): void {
    this.checkNodes(mutations.map((m) => Array.from(m.addedNodes)).flat());
  }

  protected checkNodes(nodes: Node[]): void {
    nodes.forEach((node) => this.checkNode(node));
  }

  protected checkNode(node: Node): void {
    if (isNodeElement(node)) {
      const tag = this.processName(node.nodeName);

      if (node.shadowRoot) {
        this.observe(node.shadowRoot);
      } else if (isObservableShadowElement(node)) {
        this.observeShadow(node);
      } else {
        this.tryLoadAndDefineComponent(tag, this.implMetaInDom).then(() => {
          customElements.upgrade(node);
          this.maybeObserveShadow(node);
        });
      }
    }

    this.checkNodes(Array.from(node.childNodes));
  }

  protected maybeObserveShadow(element: HTMLElement): void {
    if (isObservableShadowElement(element)) {
      this.observeShadow(element);
    }
  }

  protected observeShadow(element: ObservableShadowElement): void {
    element.whenShadowAttached().then((shadowRoot) => this.observe(shadowRoot));
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

    if (componentType[HOOKS_KEY] && this.options[HOOKS_KEY]) {
      for (const [token, methodName] of Object.entries(
        componentType[HOOKS_KEY]
      )) {
        const newHook = this.options[HOOKS_KEY][token as keyof HooksTokenMap];

        if (methodName && newHook) {
          componentType[
            methodName as keyof Omit<ComponentType, 'length' | 'name'>
          ] = newHook;
        }
      }
    }

    this.applyThemes(name);
    customElements.define(name, observableType, this.options.elementOptions);
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
  ): Promise<ComponentType | undefined> {
    if (this.componentMap.has(def.name)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.componentMap.get(def.name)!.observableType;
    }

    const [componentType, themes] = await Promise.all([
      this.loadComponentImpl(def, meta),
      this.theme?.resolve(def.name, def.theme),
    ]);

    if (!componentType) {
      return;
    }

    const observableType = observableShadow(componentType);

    this.componentMap.set(def.name, { observableType, themes, componentType });

    return observableType;
  }

  protected applyThemes(name: string): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { componentType, themes } = this.componentMap.get(name)!;

    if (!themes) {
      return;
    }

    const base = componentType.styles ?? [];
    const bases = Array.isArray(base) ? base : [base];
    let innerTheme = [...bases];

    for (const theme of themes) {
      const { styles, strategy } = theme;

      if (strategy === ThemeStrategies.ReplaceAll) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        innerTheme = this.theme!.normalizeStyles(styles);

        continue;
      }

      if (strategy === ThemeStrategies.Replace) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        innerTheme = [...bases, ...this.theme!.normalizeStyles(styles)];

        continue;
      }

      innerTheme = [
        ...innerTheme,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ...this.theme!.normalizeStyles(styles),
      ];
    }

    componentType.styles = innerTheme;

    // eslint-disable-next-line no-prototype-builtins
    if (componentType.hasOwnProperty('finalized')) {
      componentType.elementStyles = componentType.finalizeStyles?.(
        componentType.styles
      );
    }
  }

  protected async loadComponentImpl(
    def: ComponentDef,
    meta: ComponentImplMeta
  ): Promise<ComponentType | undefined> {
    const impl = def.impl;

    if (isComponentImplStrategy(impl)) {
      return await impl.load(def, meta);
    } else {
      return await this.loadComponentImplFn(impl);
    }
  }

  protected loadComponentImplFn(
    impl: ComponentType | (() => Promise<ComponentType>)
  ): ComponentType | Promise<ComponentType> {
    try {
      // Try to call as a function
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (impl as any)();
    } catch {
      // Otherwise use as a type
      return impl as ComponentType;
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
}

export class ComponentsPluginError extends Error {
  constructor(msg: string) {
    super(`ComponentsAppPlugin: ${msg}`);
  }
}

function isComponentImplStrategy(
  impl: ComponentDefImpl
): impl is ComponentImplStrategy {
  return typeof impl === 'object';
}
