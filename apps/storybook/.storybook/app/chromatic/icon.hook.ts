import { AppRef } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/injector';
import { IconHookToken } from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { ThemeChromaticPlugin } from './theme-chromatic';

export const chromaticIconHook: IconHookToken = (
  type?: string,
  spriteUrl = ''
): TemplateResult => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const themePlugin = resolve(AppRef).findPlugin(ThemeChromaticPlugin)!;

  return html`${unsafeHTML(
    `<svg viewBox="0 0 24 24">${themePlugin.getIconTemplate(type)}</svg>`
  )}`;
};
