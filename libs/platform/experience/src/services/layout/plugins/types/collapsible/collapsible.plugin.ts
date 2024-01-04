import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { html } from 'lit';
import { Observable, of } from 'rxjs';
import { LayoutStyles } from '../../../layout.model';
import {
  LayoutPlugin,
  LayoutPluginConfig,
  LayoutPluginRender,
  LayoutPluginRenderParams,
} from '../../layout.plugin';
import { renderLabelSlot } from '../util';

export class CollapsibleLayoutPlugin implements LayoutPlugin {
  getConfig(): Observable<LayoutPluginConfig> {
    return of({
      schema: () => import('./collapsible.schema').then((m) => m.schema),
    });
  }

  getStyles(): Observable<LayoutStyles> {
    return ssrAwaiter(import('./collapsible.styles').then((m) => m.styles));
  }

  getRender(
    data: LayoutPluginRenderParams
  ): Observable<LayoutPluginRender | undefined> {
    if (data.isComposition) return of();

    return of({
      outer: html`<oryx-collapsible
        ?open=${data?.options?.collapsibleOpen}
        .persistedStateKey=${data.options.collapsibleStateKey}
      >
        ${renderLabelSlot(data, 'heading', -1)} ${data.template}
      </oryx-collapsible>`,
    });
  }
}
