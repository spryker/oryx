import { AppRef } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/injector';
import { IconInjectable } from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { ThemeChromaticPlugin } from './theme-chromatic';

export class ChromaticIconInjectable implements IconInjectable {
  render(type: string): TemplateResult {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const themePlugin = resolve(AppRef).findPlugin(ThemeChromaticPlugin)!;

    return html`${unsafeHTML(
      `<svg viewBox="0 0 24 24">${themePlugin.getIconTemplate(type)}</svg>`
    )}`;
  }
}
