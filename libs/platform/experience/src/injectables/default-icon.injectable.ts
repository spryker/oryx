import { AppRef } from '@spryker-oryx/core';
import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { resolve } from '@spryker-oryx/di';
import { defaultIconFont } from '@spryker-oryx/ui/icon';
import {
  fontInjectable,
  IconHost,
  IconInjectable,
  isPromise,
} from '@spryker-oryx/utilities';
import { html, svg, TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { when } from 'lit/directives/when.js';
import { map, Observable, of } from 'rxjs';
import { IconStyles, ResourcePlugin, ThemePlugin } from '../plugins';

export class DefaultIconInjectable implements IconInjectable {
  getIcons(): string[] {
    return Object.values(
      resolve(AppRef).findPlugin(ResourcePlugin)?.getIconTypes() ?? {}
    ).filter(
      (icon) => this.renderResourceIcon(icon) || this.renderFontIcon(icon)
    );
  }

  render(
    type: string,
    host?: IconHost
  ): Observable<TemplateResult | undefined> {
    const icon = this.renderResourceIcon(type);

    if (icon) return icon;

    return this.renderFontIcon(type, host) ?? of(undefined);
  }

  protected generateStyles(styles?: IconStyles): string | undefined {
    if (!styles) {
      return undefined;
    }

    const getValue = (key: string, value: unknown): string =>
      key === 'font' ? `"${value}"` : `${value}`;

    return Object.entries(styles).reduce(
      (style, [key, value]) =>
        key === 'rtl'
          ? style
          : `${style}\n--oryx-icon-${key}: ${getValue(key, value)};`,
      ''
    );
  }

  protected renderFontIcon(
    type: string,
    host?: IconHost
  ): Observable<TemplateResult> | undefined {
    const app = resolve(AppRef);
    const mappers = app.findPlugin(ThemePlugin)?.getIcons();
    const types = app.findPlugin(ResourcePlugin)?.getIconTypes();
    const additionalFont = mappers?.resources?.find((resource) =>
      resource.types.includes(type)
    )?.resource;
    const mainSource =
      mappers?.resource.mapping?.[type] || (mappers && types?.[type])
        ? mappers.resource
        : null;
    const source = additionalFont ?? mainSource;
    const mapper = source?.mapping[type] ?? types?.[type];

    if (!mapper || !source) {
      return undefined;
    }

    const isText = typeof mapper === 'string';

    if (!isText && host && mapper.styles?.direction) host.direction = true;

    const mainStyles = this.generateStyles(source.styles);
    const styles = isText ? null : this.generateStyles(mapper.styles);
    const text = isText ? mapper : mapper.text;
    const weight = isText
      ? source.styles?.weight ?? ''
      : mapper.styles?.weight ?? source.styles?.weight ?? '';
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
  ): Observable<TemplateResult> | undefined {
    const icon = resolve(AppRef).findPlugin(ResourcePlugin)?.getIcon(type);

    if (icon === undefined) {
      return undefined;
    }

    return ssrAwaiter(isPromise(icon) ? icon : Promise.resolve(icon)).pipe(
      map(
        (_icon) => svg`${unsafeHTML(`<svg viewBox="0 0 24 24">${_icon}</svg>`)}`
      )
    );
  }
}
