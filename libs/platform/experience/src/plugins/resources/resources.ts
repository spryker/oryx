import { AppPlugin } from '@spryker-oryx/core';
import { resolveLazyLoadable } from '@spryker-oryx/core/utilities';
import { resourceInjectable } from '@spryker-oryx/utilities';
import { DefaultResourceInjectable } from '../../injectables';
import { Graphic, GraphicValue, Resources } from './resources.model';

export const ResourcePluginName = 'oryx.experience$resource';

/**
 * Resolves resources from orchestrator options.
 * Changes {@link resourceInjectable} into {@link DefaultResourceInjectable} implementation.
 */
export class ResourcePlugin implements AppPlugin {
  constructor(protected resources: Resources) {
    resourceInjectable.inject(new DefaultResourceInjectable());
  }

  getName(): string {
    return ResourcePluginName;
  }

  getResources(): Resources | undefined {
    return this.resources;
  }

  getGraphicValue(token: string, key: keyof Graphic): GraphicValue {
    const value = this.resources?.graphics?.[token]?.[key];

    if (!value) {
      return;
    }

    return resolveLazyLoadable(value);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  apply(): void {}
}
