import { App, AppPlugin } from '@spryker-oryx/core';
import {
  Breakpoints,
  ComponentDef,
  ComponentMap,
  ComponentsPlugin,
  deferHydrationAttribute,
  hydratableAttribute,
  iconInjectable,
  resolveLazyLoadable,
  rootInjectable,
} from '@spryker-oryx/utilities';
import { css, isServer, unsafeCSS } from 'lit';
import { DefaultIconInjectable } from '../../injectables';
import { ThemeTokens } from './theme-tokens';
import {
  Theme,
  ThemeIcons,
  ThemeStrategies,
  ThemeStyles,
  ThemeStylesCollection,
  ThemeStylesheets,
} from './theme.model';

export const ThemePluginName = 'oryx.experienceTheme';

/**
 * Resolves components styles from theme options.
 * Adds design tokens and global styles to the root component of into body inside style tag.
 * Resolves breakpoints for all themes.
 */
export class ThemePlugin extends ThemeTokens implements AppPlugin {
  protected icons: Partial<ThemeIcons> = {};

  constructor(protected themes: Theme[] = []) {
    super();
    this.propertiesCollector(themes);

    if (!(iconInjectable.get() instanceof DefaultIconInjectable))
      iconInjectable.inject(new DefaultIconInjectable());
  }

  getName(): string {
    return ThemePluginName;
  }

  getBreakpoints(): Breakpoints {
    return this.breakpoints;
  }

  getIcons(): ThemeIcons | undefined {
    if (!Object.keys(this.icons).length) return;

    return this.icons as ThemeIcons;
  }

  beforeApply(app: App): void {
    const components = app.requirePlugin(ComponentsPlugin);
    components.setResolver({ themes: this.resolve.bind(this) });
    components.extendComponent(this.applyThemes.bind(this));
  }

  async apply(app: App): Promise<void> {
    const components = app.requirePlugin(ComponentsPlugin);

    if (typeof components.getOptions().root === 'string' && document.body) {
      const styles = document.createElement('style');
      const streamStyles = await this.getStylesFromTokens(this.themes, ':root');
      styles.innerHTML = streamStyles.styles as string;
      document.body.prepend(styles);
    }
  }

  async resolve(
    componentDef: ComponentDef
  ): Promise<(ThemeStyles | ThemeStylesheets)[] | null> {
    const { name, stylesheets = [] } = componentDef;
    const implementations = [];

    if (!isServer) {
      const hydratable = unsafeCSS(`[${hydratableAttribute}]`);
      const deferHydration = unsafeCSS(`[${deferHydrationAttribute}]`);

      implementations.push(css`
        :not(${deferHydration}):not(${hydratable}):not(:defined) {
          display: none;
        }
      `);
    }

    for (const styles of stylesheets) {
      if (!styles.theme) {
        implementations.push(resolveLazyLoadable(styles.rules));

        continue;
      }

      const component = this.themes.find(
        (theme) => styles?.theme === theme.name
      );

      if (!component) continue;

      implementations.push(resolveLazyLoadable(styles.rules));
    }

    if (rootInjectable.get() === name)
      implementations.unshift(this.getStylesFromTokens(this.themes));

    const themes = await Promise.all(implementations);

    return themes.length ? themes : null;
  }

  protected propertiesCollector(themes: Theme[]): void {
    for (const { breakpoints, icons } of themes) {
      if (breakpoints) {
        this.breakpoints = Object.fromEntries(
          Object.entries({
            ...this.breakpoints,
            ...breakpoints,
          }).sort(([, a], [, b]) => (a.min ?? 0) - (b.min ?? 0))
        );
      }

      if (icons) {
        // Overrides main resource of the main theme and unshifts types for the additional resources
        this.icons = {
          resource: icons.resource,
          resources: [
            ...(icons.resources ?? []),
            ...(this.icons.resources ?? []),
          ],
        };
      }
    }
  }

  protected applyThemes(mapper: ComponentMap): void {
    const { extendedClass, themes } = mapper;
    const componentClass = Object.getPrototypeOf(extendedClass);

    if (!themes) return;

    const base = componentClass.styles ?? [];
    const bases = Array.isArray(base) ? base : [base];
    const isThemeStyles = (
      theme: ThemeStyles | ThemeStylesheets
    ): theme is ThemeStyles => !!(theme as ThemeStyles).styles;
    const stylesheet = themes
      .filter((theme) => !isThemeStyles(theme))
      .flat() as ThemeStylesCollection[];

    let innerTheme = [...bases, ...this.normalizeStyles(stylesheet)];

    for (const theme of themes) {
      if (!isThemeStyles(theme)) continue;

      const { styles, strategy } = theme;

      if (strategy === ThemeStrategies.ReplaceAll) {
        innerTheme = this.normalizeStyles(styles);

        continue;
      }

      if (strategy === ThemeStrategies.Replace) {
        innerTheme = [...bases, ...this.normalizeStyles(styles)];

        continue;
      }

      innerTheme = [...innerTheme, ...this.normalizeStyles(styles)];
    }

    componentClass.styles = innerTheme;

    if (Object.prototype.hasOwnProperty.call(componentClass, 'finalized')) {
      componentClass.elementStyles = componentClass.finalizeStyles?.(
        componentClass.styles
      );
    }
  }
}
