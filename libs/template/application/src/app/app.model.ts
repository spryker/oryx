import { AppBuilder, AppFeature, AppPlugin } from '@spryker-oryx/core';
import { InjectorOptions, Provider } from '@spryker-oryx/di';
import { Resources, Theme } from '@spryker-oryx/experience';
import { ComponentsInfo, ComponentsOptions } from '@spryker-oryx/utilities';

declare module '@spryker-oryx/core' {
  interface AppFeature {
    providers?: Provider[];
    components?: ComponentsInfo;
    options?: ModularAppBuilderOptions;
    plugins?: AppPlugin[];
    resources?: Resources;
    defaultOptions?: FeatureOptions;
  }
}

export interface ModularAppBuilderOptions {
  injector?: Omit<InjectorOptions, 'providers'>;
  components?: Partial<ComponentsOptions>;
}

export interface AppBuilderWithModules
  extends AppBuilder<AppBuilderWithModules> {
  withComponents(components: ComponentsInfo): AppBuilderWithModules;
  withProviders(providers: Provider[]): AppBuilderWithModules;
  withFeature(feature: AppFeature | AppFeature[]): AppBuilderWithModules;
  withAppOptions(options: ModularAppBuilderOptions): AppBuilderWithModules;
  withTheme(theme: Theme | Theme[]): AppBuilderWithModules;
  withEnvironment(env: AppEnvironment): AppBuilderWithModules;
  withResources(resources: Resources): AppBuilderWithModules;
  withOptions(options: FeatureOptions): AppBuilderWithModules;
}
