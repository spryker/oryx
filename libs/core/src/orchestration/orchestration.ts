import { PromiseSubject } from '@spryker-oryx/core/utilities';
import { Provider } from '@spryker-oryx/injector';
import { Type } from '@spryker-oryx/typescript-utils';
import {
  App,
  AppBuilder,
  AppBuilderWithModules,
  AppPlugin,
  Builder,
  isAppPluginAfterApply,
  isAppPluginBeforeApply,
  ModularAppBuilderOptions,
} from './app';
import {
  ComponentsInfo,
  ComponentsPlugin,
  ComponentsPluginOptions,
} from './components';
import { InjectionPlugin } from './injection';

export function app(): AppBuilderWithModules {
  return new ModularAppBuilder();
}

/**
 * Creates application. Plugins can be added with chaining.
 */
class SimpleAppBuilder<T = unknown> implements AppBuilder<T> {
  protected readonly plugins: AppPlugin[] = [];

  with(plugin: AppPlugin): Builder<T> {
    this.plugins.push(plugin);
    return this as unknown as Builder<T>;
  }

  async create(): Promise<App> {
    const app = this.createApp();

    await this.forEveryPlugin((plugin) => {
      if (isAppPluginBeforeApply(plugin)) {
        return plugin.beforeApply(app);
      }
    });

    await this.forEveryPlugin((plugin) => {
      app.registerPlugin(plugin);
      return plugin.apply(app);
    });

    await this.forEveryPlugin((plugin) => {
      if (isAppPluginAfterApply(plugin)) {
        return plugin.afterApply(app);
      }
    });

    app.markReady();

    return app;
  }

  protected createApp(): SimpleApp {
    return new SimpleApp();
  }

  protected async forEveryPlugin(
    runner: (plugin: AppPlugin) => void | Promise<void>
  ): Promise<void> {
    await Promise.all(this.plugins.map(runner));
  }
}

/**
 * Creates application with additional modular methods.
 */
class ModularAppBuilder extends SimpleAppBuilder<AppBuilderWithModules> {
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

/**
 * Indicates when application is ready. Registers plugins.
 */
class SimpleApp implements App {
  protected readonly plugins: AppPlugin[] = [];
  protected readonly readyPromise = new PromiseSubject<SimpleApp>();

  whenReady(): Promise<SimpleApp> {
    return this.readyPromise;
  }

  findPlugin<T extends AppPlugin>(nameOrType: string | Type<T>): T | undefined {
    const pluginByNameOrType: (plugin: AppPlugin) => boolean =
      typeof nameOrType === 'string'
        ? (plugin): boolean => plugin.getName() === nameOrType
        : (plugin): boolean => plugin instanceof nameOrType;

    return this.plugins.find(pluginByNameOrType) as T;
  }

  requirePlugin<T extends AppPlugin>(nameOrType: string | Type<T>): T {
    const maybePlugin = this.findPlugin(nameOrType);

    if (!maybePlugin) {
      throw new Error(`SimpleApp: Missing required plugin '${nameOrType}'!`);
    }

    return maybePlugin;
  }

  registerPlugin(plugin: AppPlugin): void {
    this.plugins.push(plugin);
  }

  markReady(): void {
    this.readyPromise.resolve(this);
  }
}
