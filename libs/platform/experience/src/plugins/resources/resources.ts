import { AppPlugin } from '@spryker-oryx/core';
import { resolveLazyLoadable } from '@spryker-oryx/core/utilities';
import { graphicInjectable, iconInjectable } from '@spryker-oryx/utilities';
import {
  DefaultGraphicInjectable,
  DefaultIconInjectable,
} from '../../injectables';
import {
  Graphic,
  GraphicValue,
  ResourceIcons,
  Resources,
} from './resources.model';

export const ResourcePluginName = 'oryx.experienceResource';

/**
 * Resolves resources from orchestrator options.
 * Changes {@link graphicInjectable} into {@link DefaultGraphicInjectable} implementation.
 */
export class ResourcePlugin implements AppPlugin {
  constructor(protected resources: Resources) {
    if (Object.keys(resources.graphics ?? {}).length) {
      graphicInjectable.inject(new DefaultGraphicInjectable());
    }

    if (Object.keys(resources.icons ?? {}).length) {
      iconInjectable.inject(new DefaultIconInjectable());
    }
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

  getIcons(): ResourceIcons {
    return this.resources.icons ?? {};
  }

  getIcon(icon: string): string | Promise<string> {
    return resolveLazyLoadable(this.resources.icons?.[icon] ?? '');
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  apply(): void {}
}
