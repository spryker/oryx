import { AppRef } from '@spryker-oryx/core';
import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { resolve } from '@spryker-oryx/di';
import { defaultIconFont } from '@spryker-oryx/ui/icon';
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
  getIcons(): Record<string, unknown> {
    const app = resolve(AppRef);
    const mappers = app.findPlugin(ThemePlugin)?.getIcons();
    const icons = app.findPlugin(ResourcePlugin)?.getIcons();

    return {
      ...mappers?.resource.mapping,
      ...mappers?.resources?.reduce(
        (acc, _resource) => ({
          ...acc,
          ..._resource.resource.mapping,
        }),
        {}
      ),
      ...icons,
    };
  }

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
    const weight = isText
      ? source.styles?.weight ?? ''
      : mapper.styles?.weight ?? '';
    const family = source.styles?.font ?? defaultIconFont;
    const font = `${weight} 1rem '${family}'`;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return fontInjectable
      .get()!
      .setFont(source.id, font)
      .pipe(
        map(
          (isLoaded) => html`
            ${when(
              mainStyles || styles,
              () => html`
                <style>
                  :host {
                    ${mainStyles}
                    ${styles}
                  }
                </style>
              `
            )}
            ${when(
              isLoaded,
              () => unsafeHTML(text),
              () =>
                html`
                  <span style="visibility: hidden; display: inline;">
                    ${unsafeHTML(text)}
                  </span>
                `
            )}
          `
        )
      );
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
