import { AppRef } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import {
  DefaultGraphicInjectable,
  DefaultIconInjectable,
  Graphic,
  ResourcePlugin,
} from '@spryker-oryx/experience';
import { html, TemplateResult } from 'lit';
import { DirectiveResult } from 'lit/directive.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

export class ChromaticIconInjectable extends DefaultIconInjectable {
  protected override renderResourceIcon(
    type: string
  ): TemplateResult | undefined {
    const icon = resolve(AppRef).findPlugin(ResourcePlugin)?.getIcon(type);

    if (icon === undefined) {
      return;
    }

    return html`${unsafeHTML(`<svg viewBox="0 0 24 24">${icon}</svg>`)}`;
  }
}

export class ChromaticGraphicInjectable extends DefaultGraphicInjectable {
  protected getGraphic(
    token: string,
    key: keyof Graphic
  ): DirectiveResult | undefined {
    const resourcesPlugin = resolve(AppRef).findPlugin(ResourcePlugin);
    const value = resourcesPlugin?.getGraphic(token, key);
    const render = (v: string): DirectiveResult | string =>
      key === 'source' ? unsafeHTML(v) : v;

    if (value === undefined) {
      return;
    }

    return render(value as string);
  }
}
