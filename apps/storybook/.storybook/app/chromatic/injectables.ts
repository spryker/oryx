import { AppRef } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import {
  DefaultGraphicInjectable,
  Graphic,
  ResourcePlugin,
} from '@spryker-oryx/experience';
import { IconInjectable } from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { DirectiveResult } from 'lit/directive.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

export class ChromaticIconInjectable implements IconInjectable {
  render(type: string): TemplateResult {
    const resource = resolve(AppRef).requirePlugin(ResourcePlugin);

    return html`${unsafeHTML(
      `<svg viewBox="0 0 24 24">${resource.getIcon(type)}</svg>`
    )}`;
  }
}

export class ChromaticGraphicInjectable extends DefaultGraphicInjectable {
  protected getGraphicValue(
    token: string,
    key: keyof Graphic
  ): DirectiveResult | undefined {
    const resourcesPlugin = resolve(AppRef).requirePlugin(ResourcePlugin);
    const value = resourcesPlugin.getGraphicValue(token, key);
    const render = (v: string): DirectiveResult | string =>
      key === 'source' ? unsafeHTML(v) : v;

    if (value === undefined) {
      return;
    }

    return render(value as string);
  }
}
