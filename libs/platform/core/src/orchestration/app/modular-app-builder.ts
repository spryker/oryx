import { Provider } from '@spryker-oryx/di';
import { FeatureOptions } from '../../services';
import {
  ComponentsInfo,
  ComponentsOptions,
  ComponentsPlugin,
} from '../components';
import { InjectionPlugin } from '../injection';
import { ResourcePlugin, Resources } from '../resources';
import { Theme, ThemePlugin } from '../theme';
import { SimpleAppBuilder } from './app-builder';
import { AppEnvironment } from './app-env';
import { App, AppFeature, ModularAppBuilderOptions } from './app.model';

/**
 * Creates application with additional modular methods.
 */
export class ModularAppBuilder extends SimpleAppBuilder {
  protected componentsInfo: ComponentsInfo = [];
  protected providers: Provider[] = [];
  protected options?: ModularAppBuilderOptions;
  protected themes?: Theme[];
  protected resources?: Resources;

  withAppOptions(options: ModularAppBuilderOptions): this {
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

  withComponents(componentsInfo: ComponentsInfo): this {
    this.componentsInfo.push(...componentsInfo);
    return this;
  }

  withProviders(providers: Provider[]): this {
    this.providers.push(...providers);
    return this;
  }

  withFeature(...features: AppFeature[] | AppFeature[][]): this {
    features = features.flat();

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
      for (const [key, value] of Object.entries(feat)) {
        featureMapper[key](value);
      }
    }

    return this;
  }

  withTheme(theme: Theme | Theme[]): this {
    this.themes = [
      ...(this.themes ?? []),
      ...(Array.isArray(theme) ? theme : [theme]),
    ];
    return this;
  }

  withEnvironment(env: AppEnvironment): this {
    this.withProviders([{ provide: AppEnvironment, useValue: env }]);
    return this;
  }

  withResources(resources: Resources): this {
    this.resources = {
      graphics: {
        ...(this.resources?.graphics ?? {}),
        ...(resources.graphics ?? {}),
      },
    };
    return this;
  }

  withOptions(options: FeatureOptions): this {
    this.providers.push({
      provide: FeatureOptions,
      useValue: options,
    });
    return this;
  }

  async create(): Promise<App> {
    if (this.providers.length) {
      this.with(new InjectionPlugin(this.providers, this.options?.injector));
    }

    if (this.resources) {
      this.with(new ResourcePlugin(this.resources));
    }

    if (this.themes) {
      this.with(new ThemePlugin(this.themes));
    }

    if (this.componentsInfo.length) {
      this.with(
        new ComponentsPlugin(
          this.componentsInfo,
          this.options?.components as ComponentsOptions
        )
      );
    }

    return super.create();
  }
}
