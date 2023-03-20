import { resolveLazyLoadable } from '@spryker-oryx/core/utilities';
import { iconInjectable, rootInjectable } from '@spryker-oryx/utilities';
import { DefaultIconInjectable } from '../../injectables';
import { App, AppPlugin, AppPluginBeforeApply } from '../app';
import { ComponentDef, ComponentsPlugin } from '../components';
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
export class ThemePlugin
  extends ThemeTokens
  implements AppPlugin, AppPluginBeforeApply
{
  protected icons: ThemeIcons = {};
  protected app?: App;

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

  beforeApply(app: App): void | Promise<void> {
    this.app = app;
  }

  async apply(): Promise<void> {
    const componentOptions =
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
      this.app!.findPlugin(ComponentsPlugin)!.getOptions();

    if (typeof componentOptions.root === 'string' && document.body) {
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
