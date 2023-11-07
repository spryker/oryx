import {
  App,
  AppEnvironment,
  AppFeature,
  InjectionPlugin,
  SimpleAppBuilder,
} from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import {
  ComponentsInfo,
} from '@spryker-oryx/utilities';
import { AppBuilderWithModules, ModularAppBuilderOptions } from './app.model';

/**
 * Creates application with additional modular methods.
 */
export class ModularAppBuilder extends SimpleAppBuilder<AppBuilderWithModules> {
  protected componentsInfo: ComponentsInfo = [];
  protected providers: Provider[] = [];
  protected options?: ModularAppBuilderOptions;

  withAppOptions(options: ModularAppBuilderOptions): AppBuilderWithModules {
    this.options = {
      injector: {
        ...this.options?.injector,
        ...options.injector,
      },
    };

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
      options: this.withAppOptions.bind(this),
      plugins: this.with.bind(this),
    };

    for (const feat of features) {
      for (const [key, value] of Object.entries(feat)) {
        featureMapper[key](value);
      }
    }

    return this;
  }

  withEnvironment(env: AppEnvironment): AppBuilderWithModules {
    this.withProviders([{ provide: AppEnvironment, useValue: env }]);
    return this;
  }

  async create(): Promise<App> {
    if (this.providers.length) {
      this.plugins.unshift(
        new InjectionPlugin(this.providers, this.options?.injector)
      );
    }

    return super.create();
  }
}
