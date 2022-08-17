import { Provider } from '@spryker-oryx/injector';
import {
  ComponentsInfo,
  ComponentsPlugin,
  ComponentsPluginOptions,
} from '../components';
import { InjectionPlugin } from '../injection';
import { SimpleAppBuilder } from './app-builder';
import {
  App,
  AppBuilderWithModules,
  AppFeature,
  ModularAppBuilderOptions,
} from './model';

/**
 * Creates application with additional modular methods.
 */
export class ModularAppBuilder extends SimpleAppBuilder<AppBuilderWithModules> {
  protected componentsInfo: ComponentsInfo = [];
  protected providers: Provider[] = [];
  protected options?: ModularAppBuilderOptions;

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

  withFeature(feature: AppFeature): AppBuilderWithModules {
    if (feature.providers) {
      this.withProviders(feature.providers);
    }

    if (feature.components) {
      this.withComponents(feature.components);
    }

    if (feature.options) {
      this.withOptions(feature.options);
    }

    return this;
  }

  async create(): Promise<App> {
    if (this.componentsInfo) {
      this.plugins.push(
        new ComponentsPlugin(
          this.componentsInfo,
          this.options?.components as ComponentsPluginOptions
        )
      );
    }

    if (this.providers) {
      this.plugins.push(
        new InjectionPlugin(this.providers, this.options?.injector)
      );
    }

    return super.create();
  }
}
