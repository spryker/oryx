import { AppRef } from '@spryker-oryx/core';
import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { resolve } from '@spryker-oryx/di';
import { asyncValue, IconInjectable, isPromise } from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { ResourcePlugin } from '../plugins';

export class DefaultIconInjectable implements IconInjectable {
  render(type: string): TemplateResult | undefined {
    const resourcePlugin = resolve(AppRef).findPlugin(ResourcePlugin);
    const icon = resourcePlugin?.getIcon(type);

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
