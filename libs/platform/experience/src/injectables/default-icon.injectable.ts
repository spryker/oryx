import { AppRef } from '@spryker-oryx/core';
import {
  LazyLoadable,
  resolveLazyLoadable,
  ssrAwaiter,
} from '@spryker-oryx/core/utilities';
import { resolve } from '@spryker-oryx/di';
import { defaultIconFont, IconTypes } from '@spryker-oryx/ui/icon';
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
import { IconMapper, IconsList, IconStyles, ThemePlugin } from '../plugins';

export class DefaultIconInjectable implements IconInjectable {
  getIcons(): string[] {
    return Object.values(IconTypes);
  }

  render(type: string, host: IconHost): Observable<TemplateResult | undefined> {
    const app = resolve(AppRef);
    const mappers = app.findPlugin(ThemePlugin)?.getIcons();
    const source =
      mappers?.resources?.find((resource) => resource.types.includes(type))
        ?.resource ?? mappers?.resource;

    if (!source) {
      return of(undefined);
    }

    const svgIcon = !source.mapping ? (source as IconsList)[type] : null;

    if (svgIcon) return this.renderSvgIcon(svgIcon);

    return this.renderFontIcon(source as IconMapper, type, host);
  }

  protected setStyles(styles: IconStyles | undefined, host: IconHost): void {
    if (!styles) {
      return undefined;
    }

    const getValue = (key: string, value: unknown): string =>
      key === 'font' ? `"${value}"` : `${value}`;

    for (const [key, value] of Object.entries(styles)) {
      if (key === 'direction') {
        continue;
      }

      host.style.setProperty(`--oryx-icon-${key}`, getValue(key, value));
    }
  }

  protected renderFontIcon(
    source: IconMapper,
    type: string,
    host?: IconHost
  ): Observable<TemplateResult> {
    const mapper = source?.mapping[type] ?? type;
    const isText = typeof mapper === 'string';

    if (!isText && host && mapper.styles?.direction) host.direction = true;
    if (host) this.setStyles(source.styles, host);
    if (!isText && host) this.setStyles(mapper.styles, host);

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

  protected renderSvgIcon(
    lazyIcon: LazyLoadable<string>
  ): Observable<TemplateResult> {
    const icon = resolveLazyLoadable(lazyIcon);

    return ssrAwaiter(isPromise(icon) ? icon : Promise.resolve(icon)).pipe(
      map(
        (_icon) => svg`${unsafeHTML(`<svg viewBox="0 0 24 24">${_icon}</svg>`)}`
      )
    );
  }
}
