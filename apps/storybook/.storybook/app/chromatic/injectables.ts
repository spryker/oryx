import {
  AppRef,
  DefaultResourceInjectable,
  Graphic,
  ResourcePlugin,
} from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/injector';
import { IconInjectable } from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { DirectiveResult } from 'lit-html/directive.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { ThemeChromaticPlugin } from './plugins';

export class ChromaticIconInjectable implements IconInjectable {
  render(type: string): TemplateResult {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const themePlugin = resolve(AppRef).findPlugin(ThemeChromaticPlugin)!;

    return html`${unsafeHTML(
      `<svg viewBox="0 0 24 24">${themePlugin.getIcon(type)}</svg>`
    )}`;
  }
}

export class ChromaticResourceInjectable extends DefaultResourceInjectable {
  protected getGraphicValue(
    token: string,
    key: keyof Graphic
  ): DirectiveResult | undefined {
    const resourcesPlugin = resolve(AppRef).findPlugin(ResourcePlugin);
    const value = resourcesPlugin?.getGraphicValue(token, key);
    const render = (v: string): DirectiveResult | string =>
      key === 'source' ? unsafeHTML(v) : v;

    if (value === undefined) {
      return;
    }

    return render(value as string);
  }
}
