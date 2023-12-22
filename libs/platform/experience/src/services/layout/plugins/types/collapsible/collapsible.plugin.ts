import { html } from 'lit';
import { when } from 'lit/directives/when.js';
import { Observable, of } from 'rxjs';
import {
  LayoutPlugin,
  LayoutPluginConfig,
  LayoutPluginRender,
  LayoutPluginRenderParams,
} from '../../layout.plugin';

export class CollapsibleLayoutPlugin implements LayoutPlugin {
  getConfig(): Observable<LayoutPluginConfig> {
    return of({
      schema: () => import('./collapsible.schema').then((m) => m.schema),
    });
  }

  getRender(
    data: LayoutPluginRenderParams
  ): Observable<LayoutPluginRender | undefined> {
    const customHeading =
      data.options.collapsibleTag || data.options.collapsibleTypography;

    const template = html`<oryx-collapsible
      ?open=${data.options.collapsibleOpen}
      .heading=${customHeading ? undefined : data.experience?.name}
    >
      ${when(
        customHeading,
        () => html`
          <oryx-heading
            slot="heading"
            .tag=${data.options.collapsibleTag}
            .typography=${data.options.collapsibleTypography}
          >
            ${data.experience?.name}
          </oryx-heading>
        `
      )}
      ${data.template}</oryx-collapsible
    >`;

    if (!data.isComposition && !data.options.collapsePerComponent) {
      return of({ outer: template });
    } else if (data.options.collapsePerComponent) {
      return of({ inner: template });
    }
    return of();
  }
}
