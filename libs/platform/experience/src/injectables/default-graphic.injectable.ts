import { AppRef } from '@spryker-oryx/core';
import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { resolve } from '@spryker-oryx/di';
import { GraphicInjectable, isPromise } from '@spryker-oryx/utilities';
import { DirectiveResult } from 'lit/directive.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { map } from 'rxjs';
import { Graphic, ResourcePlugin } from '../plugins';

export class DefaultGraphicInjectable implements GraphicInjectable {
  getUrl(token: string): DirectiveResult | undefined {
    return this.getGraphic(token, 'url');
  }

  getSource(token: string): DirectiveResult | undefined {
    return this.getGraphic(token, 'source');
  }

  protected getGraphic(
    token: string,
    key: keyof Graphic
  ): DirectiveResult | undefined {
    const resourcesPlugin = resolve(AppRef).findPlugin(ResourcePlugin);
    const graphic = resourcesPlugin?.getGraphic(token, key);

    return ssrAwaiter(
      isPromise(graphic) ? graphic : Promise.resolve(graphic)
    ).pipe(
      map((_graphic) => (key === 'source' ? unsafeHTML(_graphic) : _graphic))
    );
  }
}
