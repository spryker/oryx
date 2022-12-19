import { Provider } from '@spryker-oryx/injector';
import {
  ComponentsInfo,
  ComponentsPlugin,
  ComponentsPluginOptions,
} from '../components';
import { InjectionPlugin } from '../injection';
import { ResourcePlugin, Resources } from '../resources';
import { Theme, ThemePlugin } from '../theme';
import { SimpleAppBuilder } from './app-builder';
import { AppEnvironment } from './app-env';
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
  protected themes?: Theme[];
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const featureMapper: Record<string, (...args: any) => unknown> = {
      providers: this.withProviders.bind(this),
      components: this.withComponents.bind(this),
      options: this.withOptions.bind(this),
      plugins: this.with.bind(this),
      resources: this.withResources.bind(this),
    };

    for (const feat of features) {
      for (const [key, value] of Object.entries(feat)) {
        featureMapper[key](value);
      }
    }

    return this;
  }

  withTheme(theme: Theme | Theme[]): AppBuilderWithModules {
    this.themes = [
      ...(this.themes ?? []),
      ...(Array.isArray(theme) ? theme : [theme]),
    ];
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

    if (this.resources) {
      this.plugins.unshift(new ResourcePlugin(this.resources));
    }

    if (this.themes) {
      this.plugins.unshift(new ThemePlugin(this.themes));
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
