import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { html } from 'lit';
import { Observable, of } from 'rxjs';
import { LayoutStyles } from '../../../layout.model';
import {
  LayoutPlugin,
  LayoutPluginConfig,
  LayoutPluginOptionsParams,
  LayoutPluginRender,
  LayoutPluginRenderParams,
} from '../../layout.plugin';

export class CollapsibleLayoutPlugin implements LayoutPlugin {
  getStyles(data: LayoutPluginOptionsParams): Observable<LayoutStyles> {
    const { options } = data;

    return ssrAwaiter(
      import('./collapsible.styles').then((m) => {
        return m.styles;
      })
    );
  }

  getConfig(): Observable<LayoutPluginConfig> {
    return of({
      schema: () => import('./collapsible.schema').then((m) => m.schema),
    });
  }

  getRender(
    data: LayoutPluginRenderParams
  ): Observable<LayoutPluginRender | undefined> {
    console.log('data', data);
    // if (!data.experience) {
    return of({
      // outer: html`<oryx-collapsible>${data.template}</oryx-collapsible>`,
      inner: html`<oryx-collapsible heading="heading"
        >${data.template}</oryx-collapsible
      >`,
    });
    // }
    // return of({
    // });
  }
}
