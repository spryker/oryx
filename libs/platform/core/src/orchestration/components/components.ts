import { rootInjectable } from '@spryker-oryx/utilities';
import { App, AppPlugin } from '../app';
import {
  ThemeData,
  ThemePlugin,
  ThemeStrategies,
  ThemeStylesCollection,
  ThemeStylesheets,
} from '../theme';
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
export class ComponentsPlugin extends ComponentsObserver implements AppPlugin {
  protected readonly implMetaProgrammatic: ComponentImplMeta = {
    programmaticLoad: true,
  };
  protected theme?: ThemePlugin;
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

  async apply(app: App): Promise<void> {
    this.theme = app.findPlugin(ThemePlugin);

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

  protected applyThemes(name: string): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { extendedClass, themes } = this.componentMap.get(name)!;
    const componentClass = Object.getPrototypeOf(extendedClass);

    if (!themes || !this.theme) {
      return;
    }

    const base = componentClass.styles ?? [];
    const bases = Array.isArray(base) ? base : [base];
    const isThemeData = (
      theme: ThemeData | ThemeStylesheets
    ): theme is ThemeData => !!(theme as ThemeData).styles;
    const stylesheet = themes
      .filter((theme) => !isThemeData(theme))
      .flat() as ThemeStylesCollection[];

    let innerTheme = [...bases, ...this.theme.normalizeStyles(stylesheet)];

    for (const theme of themes) {
      if (!isThemeData(theme)) {
        continue;
      }

      const { styles, strategy } = theme;

      if (strategy === ThemeStrategies.ReplaceAll) {
        innerTheme = this.theme.normalizeStyles(styles);

        continue;
      }

      if (strategy === ThemeStrategies.Replace) {
        innerTheme = [...bases, ...this.theme.normalizeStyles(styles)];

        continue;
      }

      innerTheme = [...innerTheme, ...this.theme.normalizeStyles(styles)];
    }

    componentClass.styles = innerTheme;

    // eslint-disable-next-line no-prototype-builtins
    if (componentClass.hasOwnProperty('finalized')) {
      componentClass.elementStyles = componentClass.finalizeStyles?.(
        componentClass.styles
      );
    }
  }

  protected override extendComponent(name: string): void {
    this.applyThemes(name);
  }
}
