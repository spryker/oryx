import { AppPlugin } from '@spryker-oryx/core';
import { resolveLazyLoadable } from '@spryker-oryx/core/utilities';
import {
  fontInjectable,
  graphicInjectable,
  iconInjectable,
} from '@spryker-oryx/utilities';
import {
  DefaultFontInjectable,
  DefaultGraphicInjectable,
  DefaultIconInjectable,
} from '../../injectables';
import {
  Graphic,
  GraphicValue,
  ResourceGraphic,
  ResourceIcons,
  Resources,
} from './resources.model';

export const ResourcePluginName = 'oryx.experienceResource';

/**
 * Resolves resources from orchestrator options.
 * Changes {@link graphicInjectable} into {@link DefaultGraphicInjectable} implementation.
 * Changes rendering of {@link iconInjectable} for custom core implementation.
 * Resolves icons from resource options.
 */
export class ResourcePlugin implements AppPlugin {
  constructor(protected resources: Resources) {
    graphicInjectable.inject(new DefaultGraphicInjectable());

    if (!(iconInjectable.get() instanceof DefaultIconInjectable)) {
      iconInjectable.inject(new DefaultIconInjectable());
    }

    fontInjectable.inject(new DefaultFontInjectable());
  }

  getName(): string {
    return ResourcePluginName;
  }

  getGraphics(): ResourceGraphic | undefined {
    return this.resources.graphics;
  }

  getGraphic(token: string, key: keyof Graphic): GraphicValue {
    const value = this.getGraphics()?.[token]?.[key];

    if (!value) {
      return;
    }

    return resolveLazyLoadable(value);
  }

  getIcons(): ResourceIcons {
    return this.resources.icons?.list ?? {};
  }

  getIconTypes(): Record<string, string> {
    return this.resources.icons?.types ?? {};
  }

  getIcon(name: string): string | Promise<string> | void {
    const icon = this.getIcons()[name];

    if (!icon) {
      return;
    }

    return resolveLazyLoadable(icon);
  }

  getFont(id: string): string | undefined {
    return this.resources.fonts?.[id];
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  apply(): void {}
}
