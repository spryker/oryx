import { Provider } from '@spryker-oryx/injector';
import {
  ComponentsInfo,
  ComponentsPlugin,
  ComponentsPluginOptions,
} from '../components';
import { InjectionPlugin } from '../injection';
import { Theme, ThemePlugin } from '../theme';
import { SimpleAppBuilder } from './app-builder';
import {
  App,
  AppBuilderWithModules,
  AppFeature,
  ModularAppBuilderOptions,
} from './app.model';

/**
 * Creates application with additional modular methods.
 */
export class ModularAppBuilder extends SimpleAppBuilder<AppBuilderWithModules> {
  protected componentsInfo: ComponentsInfo = [];
  protected providers: Provider[] = [];
  protected options?: ModularAppBuilderOptions;
  protected themes: Theme[] = [];

  withOptions(options: ModularAppBuilderOptions): AppBuilderWithModules {
    this.options = {
      injector: {
        ...this.options?.injector,
        ...options.injector,
      },
      components: {
        ...this.options?.components,
        ...options.components,
      },
    };

    return this;
  }

  withComponents(componentsInfo: ComponentsInfo): AppBuilderWithModules {
    this.componentsInfo.push(...componentsInfo);
    return this;
  }

  withProviders(providers: Provider[]): AppBuilderWithModules {
    this.providers.push(...providers);
    return this;
  }

  withFeature(feature: AppFeature | AppFeature[]): AppBuilderWithModules {
    const features = Array.isArray(feature) ? feature : [feature];

    for (const feat of features) {
      if (feat.providers) {
        this.withProviders(feat.providers);
      }

      if (feat.components) {
        this.withComponents(feat.components);
      }

      if (feat.options) {
        this.withOptions(feat.options);
      }

      if (feat.plugins) {
        feat.plugins.forEach((plugin) => {
          this.with(plugin);
        });
      }
    }

    return this;
  }

  withTheme(theme: Theme | Theme[]): AppBuilderWithModules {
    this.themes.push(...(Array.isArray(theme) ? theme : [theme]));
    return this;
  }

  async create(): Promise<App> {
    if (this.themes.length) {
      this.plugins.push(new ThemePlugin(this.themes));
    }

    if (this.providers.length) {
      this.plugins.push(
        new InjectionPlugin(this.providers, this.options?.injector)
      );
    }

    if (this.componentsInfo.length) {
      this.plugins.push(
        new ComponentsPlugin(
          this.componentsInfo,
          this.options?.components as ComponentsPluginOptions
        )
      );
    }

    return super.create();
  }
}
