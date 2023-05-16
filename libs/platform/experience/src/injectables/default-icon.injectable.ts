import { AppRef } from '@spryker-oryx/core';
import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { resolve } from '@spryker-oryx/di';
import {
  asyncValue,
  fontInjectable,
  IconInjectable,
  isPromise,
} from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { when } from 'lit/directives/when.js';
import { ResourcePlugin, ThemePlugin } from '../plugins';

export class DefaultIconInjectable implements IconInjectable {
  render(type: string): TemplateResult | undefined {
    const app = resolve(AppRef);
    const mappers = app.findPlugin(ThemePlugin)?.getIcons();
    const source = mappers?.resource.mapping?.[type]
      ? mappers.resource
      : mappers?.resources?.find((resource) => resource.types.includes(type))
          ?.resource;
    const mapper = source?.mapping[type];

    if (mapper) {
      fontInjectable.get()?.setFont(source.id);

      return html`
        ${when(
          source.styles,
          () => html`<style>
            :host {${source.styles}}
          </style>`
        )}
        ${unsafeHTML(mapper)}
      `;
    }

    const icon = app.findPlugin(ResourcePlugin)?.getIcon(type);

    if (icon === undefined) {
      return;
    }

    const icon$ = ssrAwaiter(isPromise(icon) ? icon : Promise.resolve(icon));

    return html`
      ${asyncValue(icon$, (res) =>
        res
          ? html`${unsafeHTML(`<svg viewBox="0 0 24 24">${res}</svg>`)}`
          : html``
      )}
    `;
  }
}
