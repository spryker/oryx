import { ModularAppBuilderOptions } from '@spryker-oryx/application';
import { AppFeature } from '@spryker-oryx/core';
import { ComponentInfo, ComponentsInfo } from '@spryker-oryx/utilities';
import { fulfillmentRootComponent } from './components';

/**
 * @deprecated Since version 1.2.
 */
export interface FulfillmentRootFeatureConfig {
  selector?: string;
}

/**
 * @deprecated Since version 1.2.
 */
export class FulfillmentRootFeature implements AppFeature {
  options: ModularAppBuilderOptions;
  components: ComponentsInfo;

  constructor(config?: FulfillmentRootFeatureConfig) {
    this.options = this.getOptions(config);
    this.components = this.getComponents(config);
  }

  protected getOptions(
    config?: FulfillmentRootFeatureConfig
  ): ModularAppBuilderOptions {
    return {
      components: { root: this.getRootComponent(config) },
    };
  }

  protected getComponents(
    config?: FulfillmentRootFeatureConfig
  ): ComponentsInfo {
    return [this.getRootComponent(config)];
  }

  protected getRootComponent(
    config?: FulfillmentRootFeatureConfig
  ): ComponentInfo {
    return fulfillmentRootComponent(
      config ? { name: config?.selector } : undefined
    );
  }
}
