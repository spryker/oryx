import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { when } from 'lit/directives/when.js';
import { Observable, of } from 'rxjs';
import { LayoutStyles } from '../../../layout.model';
import {
  LayoutPlugin,
  LayoutPluginConfig,
  LayoutPluginOptionsParams,
  LayoutPluginRender,
  LayoutPluginRenderParams,
} from '../../layout.plugin';

export class DropdownLayoutPlugin implements LayoutPlugin {
  getStyles(data: LayoutPluginOptionsParams): Observable<LayoutStyles> {
    return ssrAwaiter(
      import('./dropdown.styles').then((m) => {
        return {
          styles: `${m.dropdownStyles}`,
        };
      })
    );
  }

  getConfig(): Observable<LayoutPluginConfig> {
    return of({
      schema: () => import('./dropdown.schema').then((m) => m.schema),
    });
  }

  getRender(
    data: LayoutPluginRenderParams
  ): Observable<LayoutPluginRender | undefined> {
    const trigger = data.options.dropdownTrigger;
    return of({
      outer: html` <oryx-dropdown vertical-align position="start">
        ${when(trigger, () =>
          unsafeHTML(`<${trigger} slot="trigger"></${trigger}>`)
        )}
        <div close-popover>${data.template}</div>
      </oryx-dropdown>`,
    });
  }
}
