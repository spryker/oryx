import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { resolve } from '@spryker-oryx/injector';
import { IconHookToken } from '@spryker-oryx/utilities';
import { asyncValue } from '@spryker-oryx/utilities/lit-rxjs';
import { html, svg, TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { AppRef, ThemePlugin } from '../orchestration';

export const iconHook: IconHookToken = (
  type?: string,
  spriteUrl = ''
): TemplateResult => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const themePlugin = resolve(AppRef).findPlugin(ThemePlugin)!;
  const icon$ = ssrAwaiter(themePlugin.getIcon(type));

  return html`
    ${asyncValue(icon$, (res) =>
      res
        ? html`${unsafeHTML(`<svg viewBox="0 0 24 24">${res}</svg>`)}`
        : svg`
            <svg viewBox="0 0 24 24">
              <use href="${spriteUrl}" />
            </svg>
          `
    )}
  `;
};
