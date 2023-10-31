import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { html } from 'lit';
import { Observable, of } from 'rxjs';
import { LayoutStyles } from '../../../layout.model';
import {
  LayoutPlugin,
  LayoutPluginConfig,
  LayoutPluginParams,
  LayoutPluginRender,
  LayoutStyleParameters,
  LayoutStyleProperties,
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

  getStyleProperties(
    data: LayoutStyleParameters
  ): Observable<LayoutStyleProperties> {
    return of({
      '--scroll-with-mouse': data.layout?.scrollWithMouse ? 'auto' : 'hidden',
      '--scroll-with-touch': data.layout?.scrollWithTouch ? 'auto' : 'hidden',
    });
  }

  /**
   * @override Returns a render function that renders the carousel navigation
   */
  getRender(data: LayoutPluginParams): LayoutPluginRender | undefined {
    console.log('render carousel navigation');
    if (
      data.experience || // we have nested components
      (!data.options?.showArrows && !data.options?.showIndicators)
    ) {
      return;
    }

    return {
      pre: html`<oryx-carousel-navigation
        ?showArrows=${data.options?.showArrows}
        ?showIndicators=${data.options?.showIndicators}
        .arrowNavigationBehavior=${data.options?.arrowNavigationBehavior}
        .indicatorsPosition=${data.options?.indicatorsPosition}
        .indicatorsAlignment=${data.options?.indicatorsAlignment}
        .scrollBehavior=${data.options?.scrollBehavior}
      ></oryx-carousel-navigation>`,
    };
  }
}
