import { rootInjectable } from '../../injectables';
import { BuilderPlugin } from '../plugins.model';
import { ComponentsObserver } from './components-observer';
import {
  ComponentImplMeta,
  ComponentsInfo,
  ComponentsOptions,
  ComponentType,
} from './components.model';
import { ComponentsPluginError } from './utilities';

export const ComponentsPluginName = 'core$components';

/**
 *  Registers, loads and defines components. Observes nodes (including shadowDOM).
 *  Defines components in lazy-load and preload modes, depends on options {@link ComponentsOptions}.
 *  Applies theme styles for component definition.
 */
export class ComponentsPlugin
  extends ComponentsObserver
  implements BuilderPlugin
{
  protected readonly implMetaProgrammatic: ComponentImplMeta = {
    programmaticLoad: true,
  };
  protected rootSelector = '';

  constructor(
    protected componentsInfo: ComponentsInfo,
    protected options: ComponentsOptions
  ) {
    super(options);
    this.registerComponents(componentsInfo);
    rootInjectable.inject(
      typeof this.options.root === 'string'
        ? this.options.root
        : this.processDef(this.options.root).name
    );
  }

  getName(): string {
    return ComponentsPluginName;
  }

  async apply(): Promise<void> {
    const root = rootInjectable.get();

    if (this.options.preload) {
      await this.preloadComponents();

      return;
    }

    const rootElement = document.querySelector?.(root);

    if (!rootElement) {
      throw new ComponentsPluginError(
        `Cannot find root element by selector '${root}'!`
      );
    }

    await this.preloadComponents();

    this.observe(rootElement);
  }

  registerComponents(componentsInfo: ComponentsInfo): void {
    componentsInfo.flat().forEach((info) => {
      const def = this.processDef(info);
      this.componentDefMap.set(def.name, def);
    });
  }

  getOptions(): ComponentsOptions {
    return this.options;
  }

  async loadComponent(name: string): Promise<ComponentType | undefined> {
    return this.loadAndDefineComponent(name, this.implMetaProgrammatic);
  }
}
