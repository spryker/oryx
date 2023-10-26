import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { html } from 'lit';
import { Observable } from 'rxjs';
import { LayoutStyles } from '../../layout.model';
import {
  LayoutPlugin,
  LayoutPluginConfig,
  LayoutPluginParams,
  LayoutPluginRender,
} from '../layout.plugin';

export class CarouselLayoutPlugin implements LayoutPlugin {
  getStyles(): Observable<LayoutStyles> {
    return ssrAwaiter(import('./carousel-layout.styles').then((m) => m.styles));
  }

  getConfig(): LayoutPluginConfig {
    return { name: 'carousel' };
  }

  getRender(data: LayoutPluginParams): LayoutPluginRender | undefined {
    if (data?.experience) return;

    return {
      pre: html`pre2`,
      post: html`post`,
    };
  }
}
