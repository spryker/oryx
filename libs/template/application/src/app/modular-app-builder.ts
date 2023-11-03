import {
  App,
  AppEnvironment,
  AppFeature,
  FeatureOptions,
  InjectionPlugin,
  SimpleAppBuilder,
} from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import {
  ResourcePlugin,
  Resources,
  Theme,
  ThemePlugin,
} from '@spryker-oryx/experience';
import {
  ComponentsInfo,
  ComponentsOptions,
  ComponentsPlugin,
} from '@spryker-oryx/utilities';
import { AppBuilderWithModules, ModularAppBuilderOptions } from './app.model';

/**
 * Creates application with additional modular methods.
 */
export class ModularAppBuilder extends SimpleAppBuilder<AppBuilderWithModules> {
  protected componentsInfo: ComponentsInfo = [];
  protected providers: Provider[] = [];
  protected options?: ModularAppBuilderOptions;
  protected themes?: Theme[];
  protected resources?: Resources;

  withAppOptions(options: ModularAppBuilderOptions): AppBuilderWithModules {
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
      options: this.withAppOptions.bind(this),
      plugins: this.with.bind(this),
      resources: this.withResources.bind(this),
      defaultOptions: this.withOptions.bind(this),
    };

    for (const feat of features) {
      for (const [key, value] of Object.entries(feat))
        featureMapper[key](value);
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
    this.resources = Object.entries(resources).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: { ...acc[key as keyof Resources], ...value },
      }),
      this.resources ?? {}
    );
    return this;
  }

  withOptions(options: FeatureOptions): AppBuilderWithModules {
    this.providers.push({
      provide: FeatureOptions,
      useValue: options,
    });
    return this;
  }

  async create(): Promise<App> {
    if (this.providers.length) {
      this.plugins.unshift(
        new InjectionPlugin(this.providers, this.options?.injector)
      );
    }

    if (this.resources)
      this.plugins.unshift(new ResourcePlugin(this.resources));

    if (this.themes) this.plugins.unshift(new ThemePlugin(this.themes));

    if (this.componentsInfo.length) {
      this.plugins.unshift(
        new ComponentsPlugin(
          this.componentsInfo,
          this.options?.components as ComponentsOptions
        )
      );
    }

    return super.create();
  }
}
