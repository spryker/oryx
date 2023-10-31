import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { html } from 'lit';
import { Observable, of } from 'rxjs';
import { LayoutStyles } from '../../../layout.model';
import {
  LayoutPlugin,
  LayoutPluginConfig,
  LayoutPluginParams,
  LayoutPluginRender,
} from '../../layout.plugin';

export class CarouselLayoutPlugin implements LayoutPlugin {
  getStyles(): Observable<LayoutStyles> {
    return ssrAwaiter(import('./carousel-layout.styles').then((m) => m.styles));
  }

  getConfig(): Observable<LayoutPluginConfig> {
    return of({
      schema: () => import('./carousel-layout.schema').then((m) => m.schema),
    });
  }

  getRender(
    data: LayoutPluginParams
  ): Observable<LayoutPluginRender | undefined> {
    return of({
      pre: html`pre ${data.element?.tagName}`,
      post: html`post ${data.element?.tagName}`,
    });
  }
}
