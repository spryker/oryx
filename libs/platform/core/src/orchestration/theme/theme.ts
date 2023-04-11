import { resolveLazyLoadable } from '@spryker-oryx/core/utilities';
import {
  deferHydrationAttribute,
  hydratableAttribute,
  iconInjectable,
  rootInjectable,
} from '@spryker-oryx/utilities';
import { css, isServer, unsafeCSS } from 'lit';
import { DefaultIconInjectable } from '../../injectables';
import { HeadDOMService } from '../../services/head-dom';
import { App, AppPlugin } from '../app';
import { ComponentDef, ComponentsPlugin } from '../components';
import { InjectionPlugin } from '../injection';
import { ThemeTokens } from './theme-tokens';
import {
  Theme,
  ThemeBreakpoints,
  ThemeData,
  ThemeIcons,
  ThemeStylesheets,
} from './theme.model';

export const ThemePluginName = 'core$theme';

/**
 * Resolves components styles from theme options.
 * Adds design tokens and global styles to the root component of into body inside style tag.
 * Changes rendering of {@link iconInjectable} for custom core implementation.
 * Resolves icons from theme options.
 * Resolves breakpoints for all themes.
 */
export class ThemePlugin extends ThemeTokens implements AppPlugin {
  protected icons: ThemeIcons = {};

  constructor(protected themes: Theme[] = []) {
    super();
    this.propertiesCollector(themes);
  }

  getName(): string {
    return ThemePluginName;
  }

  getIcons(): ThemeIcons {
    return this.icons;
  }

  getBreakpoints(): ThemeBreakpoints {
    return this.breakpoints as ThemeBreakpoints;
  }

  getIcon(icon: string): string | Promise<string> {
    return resolveLazyLoadable(this.icons[icon]);
  }

  async apply(app: App): Promise<void> {
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    const components = app.findPlugin(ComponentsPlugin)!;
    const injection = app.findPlugin(InjectionPlugin)!;
    /* eslint-enable @typescript-eslint/no-non-null-assertion */
    // Uses head of latest theme
    const head = this.themes.at(-1)?.head;

    if (head) {
      injection.getInjector().inject(HeadDOMService).addElements(head);
    }

    if (typeof components.getOptions().root === 'string' && document.body) {
      const styles = document.createElement('style');
      const streamStyles = await this.getStylesFromTokens(this.themes, ':root');
      styles.innerHTML = streamStyles.styles as string;
      document.body.prepend(styles);
    }
  }

  async resolve(
    componentDef: ComponentDef
  ): Promise<(ThemeData | ThemeStylesheets)[] | null> {
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

      if (!component) {
        continue;
      }

      implementations.push(resolveLazyLoadable(styles.rules));
    }

    if (rootInjectable.get() === name) {
      implementations.unshift(this.getStylesFromTokens(this.themes));
    }

    const themes = await Promise.all(implementations);

    return themes.length ? themes : null;
  }

  protected propertiesCollector(themes: Theme[]): void {
    for (const { breakpoints, icons } of themes) {
      const sortableBP = Object.fromEntries(
        Object.entries(breakpoints ?? {}).sort(([, a], [, b]) => a.min - b.min)
      );

      this.breakpoints = {
        ...this.breakpoints,
        ...sortableBP,
      };

      this.icons = {
        ...this.icons,
        ...icons,
      };
    }

    if (Object.keys(this.icons).length) {
      iconInjectable.inject(new DefaultIconInjectable());
    }
  }
}
