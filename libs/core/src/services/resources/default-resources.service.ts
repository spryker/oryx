import { resolveLazyLoadable } from '@spryker-oryx/core/utilities';
import { inject } from '@spryker-oryx/injector';
import { AppRef, Graphic, Resources, ThemePlugin } from '../../orchestration';
import { GraphicValue, ResourceService } from './resources.service';

export class DefaultResourceService implements ResourceService {
  protected resources?: Resources;

  constructor(app = inject(AppRef)) {
    this.resources = app.findPlugin(ThemePlugin)?.getResources();
  }

  getGraphicValue(token: string, key: keyof Graphic): GraphicValue {
    const value = this.resources?.graphics?.[token]?.[key];

    if (!value) {
      return;
    }

    return resolveLazyLoadable(value);
  }
}
