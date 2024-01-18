import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { Observable, map, of } from 'rxjs';
import { LayoutStyles, LayoutStylesOptions } from '../../../layout.model';
import {
  LayoutPlugin,
  LayoutPluginConfig,
  LayoutPluginOptionsParams,
  LayoutPluginRender,
  LayoutPluginRenderParams,
} from '../../layout.plugin';

import { Position } from '@spryker-oryx/ui';
import { html } from 'lit';
import { renderLabelSlot } from '../util';

export class DropdownLayoutPlugin implements LayoutPlugin {
  getConfig(): Observable<LayoutPluginConfig> {
    return of({
      schema: () => import('./dropdown.schema').then((m) => m.schema),
    });
  }

  getStyles(data: LayoutPluginOptionsParams): Observable<LayoutStyles> {
    // TODO: add isComposition to data set so we can better check
    if (data.options.layout !== 'dropdown') return of();

    return ssrAwaiter(import('./dropdown.styles').then((m) => m.styles));
  }

  getRender(
    data: LayoutPluginRenderParams
  ): Observable<LayoutPluginRender | undefined> {
    if (!data.isComposition) {
      return this.getDefaultProperties().pipe(
        map((defaultOptions) => {
          const options = { ...defaultOptions, ...data.options };

          return {
            outer: html`<oryx-dropdown
              .position=${options.dropdownPosition}
              vertical-align
              ?openOnHover=${options.dropdownOnHover}
            >
              ${renderLabelSlot(data, 'trigger')}

              <oryx-composition
                .uid=${data.experience?.id}
                .options=${{}}
                close-popover
              ></oryx-composition>
            </oryx-dropdown>`,
          };
        })
      );
    }
    return of();
  }

  getDefaultProperties(): Observable<LayoutStylesOptions> {
    return of({
      dropdownPosition: Position.End,
      bucket: true,
    });
  }
}
