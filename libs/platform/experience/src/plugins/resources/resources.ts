import { App, AppPlugin, AppPluginBeforeApply } from '@spryker-oryx/core';
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
import { ThemePlugin } from '../theme';
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
export class ResourcePlugin implements AppPlugin, AppPluginBeforeApply {
  protected app!: App;

  constructor(protected resources: Resources) {
    graphicInjectable.inject(new DefaultGraphicInjectable());
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

    if (!value) {
      return;
    }

    return resolveLazyLoadable(value);
  }

  getIcons(): ResourceIcons {
    const themeIcons = this.app.findPlugin(ThemePlugin)?.getIcons();

    if (!themeIcons) {
      return this.resources.icons ?? {};
    }

    return {
      ...themeIcons.resource.mapping,
      ...this.resources.icons,
      ...themeIcons.resources?.reduce(
        (acc, _resource) => ({
          ...acc,
          ..._resource.resource.mapping,
        }),
        {}
      ),
    };
  }

  getIcon(name: string): string | Promise<string> | void {
    const icon = this.resources.icons?.[name];

    if (!icon) {
      return;
    }

    return resolveLazyLoadable(icon);
  }

  getFont(id: string): string | undefined {
    return this.resources.fonts?.[id];
  }

  beforeApply(app: App): void {
    this.app = app;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  apply(): void {}
}
