import { AppPlugin } from '@spryker-oryx/core';
import {
  fontInjectable,
  graphicInjectable,
  iconInjectable,
  resolveLazyLoadable,
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

    if (!(iconInjectable.get() instanceof DefaultIconInjectable))
      iconInjectable.inject(new DefaultIconInjectable());

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

    if (!value) return;

    return resolveLazyLoadable(value);
  }

  getFont(id: string): string | undefined {
    return this.resources.fonts?.[id];
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  apply(): void {}
}
