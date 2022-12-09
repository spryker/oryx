import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { resolve } from '@spryker-oryx/injector';
import { DefaultIconInjectable, IconInjectable } from '@spryker-oryx/utilities';
import { asyncValue } from '@spryker-oryx/utilities/lit-rxjs';
import { html, TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { of } from 'rxjs';
import { AppRef, ThemePlugin } from '../orchestration';

export class ThemeIconInjectable implements IconInjectable {
  render(type?: string, spriteUrl?: string): TemplateResult {
    const themePlugin = resolve(AppRef).findPlugin(ThemePlugin);
    const icon$ = ssrAwaiter(themePlugin?.getIcon(type) ?? of(null));

    return html`
      ${asyncValue(icon$, (res) =>
        res
          ? html`${unsafeHTML(`<svg viewBox="0 0 24 24">${res}</svg>`)}`
          : new DefaultIconInjectable().render(type, spriteUrl)
      )}
    `;
  }
}
