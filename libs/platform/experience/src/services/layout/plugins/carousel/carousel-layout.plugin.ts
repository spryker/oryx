import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { html } from 'lit';
import { Observable } from 'rxjs';
import { LayoutStyles } from '../../layout.model';
import {
  LayoutPlugin,
  LayoutPluginConfig,
  LayoutPluginRender,
} from '../layout.plugin';

export class CarouselLayoutPlugin implements LayoutPlugin {
  getStyles(): Observable<LayoutStyles> {
    return ssrAwaiter(import('./carousel-layout.styles').then((m) => m.styles));
  }

  getConfig(): LayoutPluginConfig {
    return { name: 'carousel' };
  }

  getRender(data?: unknown): LayoutPluginRender {
    console.log(data);
    return {
      pre: html`pre`,
      post: html`post`,
    };
  }
}
