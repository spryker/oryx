import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { signal } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { Observable, of } from 'rxjs';
import { Observable, map, of } from 'rxjs';
import { LayoutStyles } from '../../../layout.model';
import {
  LayoutPlugin,
  LayoutPluginConfig,
  LayoutPluginParams,
  LayoutPluginRender,
  LayoutStyleParameters,
  LayoutStyleProperties,
} from '../../layout.plugin';
import {
  ArrowNavigationBehavior,
  CarouselIndicatorAlignment,
  CarouselIndicatorPosition,
  CarouselLayoutProperties,
  CarouselScrollBehavior,
} from './carousel-layout.model';
  LayoutPluginOptionsParams,
} from '../../layout.plugin';

export class CarouselLayoutPlugin implements LayoutPlugin {
  getStyles(data: LayoutPluginOptionsParams): Observable<LayoutStyles> {
    const { options } = data;

    return ssrAwaiter(import('./carousel-layout.styles')).pipe(
      map((m) => {
        if (!options.vertical) return m.styles;

        return {
          ...m.styles,
          styles: `${m.styles.styles}${m.verticalStyles.styles}`,
        };
      })
    );
  }

  getConfig(): Observable<LayoutPluginConfig> {
    return of({
      schema: () => import('./carousel-layout.schema').then((m) => m.schema),
    });
  }

  getStyleProperties(
    data: LayoutStyleParameters
  ): Observable<LayoutStyleProperties> {
    const options = { ...data.layout, ...this.$options() };
    return of({
      '--scroll-with-mouse': options.scrollWithMouse ? 'auto' : 'hidden',
      '--scroll-with-touch': options.scrollWithTouch ? 'auto' : 'hidden',
    });
  }

  /**
   * @override Returns a render function that renders the carousel navigation
   */
  getRender(data: LayoutPluginParams): LayoutPluginRender | undefined {
    const options = { ...data.options, ...this.$options() };
    if (
      data.experience || // we have nested components
      (!options?.showArrows && !options?.showIndicators)
    ) {
      return;
    }
    return {
      pre: html`<oryx-carousel-navigation
        ?showArrows=${options?.showArrows}
        ?showIndicators=${options?.showIndicators}
        ?scrollWithMouse=${options?.scrollWithMouse}
        ?scrollWithTouch=${options?.scrollWithTouch}
        .arrowNavigationBehavior=${options?.arrowNavigationBehavior}
        .indicatorsPosition=${options?.indicatorsPosition}
        .indicatorsAlignment=${options?.indicatorsAlignment}
        .scrollBehavior=${options?.scrollBehavior}
      ></oryx-carousel-navigation>`,
    };
  }

  protected $options = signal(this.getDefaultProperties());

  getDefaultProperties(): Observable<CarouselLayoutProperties> {
    return of({
      showArrows: true,
      showIndicators: true,
      scrollBehavior: CarouselScrollBehavior.Smooth,
      arrowNavigationBehavior: ArrowNavigationBehavior.Item,
      scrollWithMouse: true,
      scrollWithTouch: true,
      indicatorsAlignment: CarouselIndicatorAlignment.Center,
      indicatorsPosition: CarouselIndicatorPosition.Below,
    });
  }
}
