import { Provider } from '@spryker-oryx/injector';
import {
  ComponentsInfo,
  ComponentsPlugin,
  ComponentsPluginOptions,
} from '../components';
import { InjectionPlugin } from '../injection';
import { Resources, Theme, ThemePlugin } from '../theme';
import { SimpleAppBuilder } from './app-builder';
import {
  App,
  AppBuilderWithModules,
  AppEnvironment,
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
  protected resources?: Resources;

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
        this.with(feat.plugins);
      }

      if (feat.resources) {
        this.withResources(feat.resources);
      }
    }

    return this;
  }

  withTheme(theme: Theme | Theme[]): AppBuilderWithModules {
    this.themes.push(...(Array.isArray(theme) ? theme : [theme]));
    return this;
  }

  withEnvironment(env: AppEnvironment): AppBuilderWithModules {
    this.withProviders([{ provide: AppEnvironment, useValue: env }]);
    return this;
  }

  withResources(resources: Resources): AppBuilderWithModules {
    this.resources = {
      graphics: {
        ...(this.resources?.graphics ?? {}),
        ...(resources.graphics ?? {}),
      },
    };
    return this;
  }

  async create(): Promise<App> {
    if (this.providers.length) {
      this.plugins.unshift(
        new InjectionPlugin(this.providers, this.options?.injector)
      );
    }

    if (this.themes.length) {
      this.plugins.unshift(new ThemePlugin(this.themes, this.resources));
    }

    if (this.componentsInfo.length) {
      this.plugins.unshift(
        new ComponentsPlugin(
          this.componentsInfo,
          this.options?.components as ComponentsPluginOptions
        )
      );
    }

    return super.create();
  }
}
