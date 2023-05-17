import { AppRef } from '@spryker-oryx/core';
import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { resolve } from '@spryker-oryx/di';
import {
  fontInjectable,
  IconInjectable,
  isPromise,
} from '@spryker-oryx/utilities';
import { html, svg, TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { when } from 'lit/directives/when.js';
import { map, Observable, of } from 'rxjs';
import { IconStyles, ResourcePlugin, ThemePlugin } from '../plugins';

export class DefaultIconInjectable implements IconInjectable {
  render(type: string): Observable<TemplateResult | undefined> {
    const icon = this.renderFontIcon(type);

    if (icon) return icon;

    return this.renderResourceIcon(type);
  }

  protected generateStyles(styles?: IconStyles): string | undefined {
    if (!styles) {
      return undefined;
    }

    const getValue = (key: string, value: unknown): string =>
      key === 'font' ? `"${value}"` : `${value}`;

    return Object.entries(styles).reduce(
      (style, [key, value]) =>
        `${style}\n--oryx-icon-${key}: ${getValue(key, value)};`,
      ''
    );
  }

  protected renderFontIcon(
    type: string
  ): Observable<TemplateResult> | undefined {
    const mappers = resolve(AppRef).findPlugin(ThemePlugin)?.getIcons();
    const source = mappers?.resource.mapping?.[type]
      ? mappers.resource
      : mappers?.resources?.find((resource) => resource.types.includes(type))
          ?.resource;
    const mapper = source?.mapping[type];

    if (!mapper) {
      return undefined;
    }

    const isText = typeof mapper === 'string';
    const mainStyles = this.generateStyles(source.styles);
    const styles = isText ? null : this.generateStyles(mapper.styles);
    const text = isText ? mapper : mapper.text;
    fontInjectable.get()?.setFont(source.id);

    return of(html`
      ${when(
        mainStyles || styles,
        () => html`<style>
          /*  */
          :host {
            ${mainStyles}
            ${styles}
          }
        </style>`
      )}
      ${unsafeHTML(text)}
    `);
  }

  protected renderResourceIcon(
    type: string
  ): Observable<TemplateResult | undefined> {
    const icon = resolve(AppRef).findPlugin(ResourcePlugin)?.getIcon(type);

    if (icon === undefined) {
      return of(undefined);
    }

    return ssrAwaiter(isPromise(icon) ? icon : Promise.resolve(icon)).pipe(
      map(
        (_icon) => svg`${unsafeHTML(`<svg viewBox="0 0 24 24">${_icon}</svg>`)}`
      )
    );
  }
}
