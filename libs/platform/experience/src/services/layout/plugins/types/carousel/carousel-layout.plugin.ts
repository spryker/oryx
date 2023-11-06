import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { signal } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { Observable, of } from 'rxjs';
import { LayoutStyles, LayoutStylesOptions } from '../../../layout.model';
import {
  LayoutPlugin,
  LayoutPluginConfig,
  LayoutPluginOptionsParams,
  LayoutPluginPropertiesParams,
  LayoutPluginRender,
  LayoutPluginRenderParams,
  LayoutStyleProperties,
} from '../../layout.plugin';
import {
  ArrowNavigationBehavior,
  CarouselIndicatorAlignment,
  CarouselIndicatorPosition,
  CarouselScrollBehavior,
} from './carousel-layout.model';

export class CarouselLayoutPlugin implements LayoutPlugin {
  getStyles(data: LayoutPluginOptionsParams): Observable<LayoutStyles> {
    const { options } = data;

    return ssrAwaiter(
      import('./carousel-layout.styles').then((m) => {
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
    data: LayoutPluginPropertiesParams
  ): Observable<LayoutStyleProperties> {
    const options = { ...this.$defaultOptions(), ...data.styles.layout };
    const props: any = {};

    if (!options.scrollWithMouse) props['--scroll-with-mouse'] = 'hidden';
    if (!options.scrollWithTouch) props['--scroll-with-touch'] = 'hidden';
    if (
      options.showIndicators &&
      options.indicatorsPosition === CarouselIndicatorPosition.Below
    )
      props['--indicator-area-height'] = '50px;';

    props['margin-block-end'] = 'var(--indicator-area-height)';

    return of(props);
  }

  /**
   * @override Returns a render function that renders the carousel navigation
   * in the pre render template position.
   */
  getRender(
    data: LayoutPluginRenderParams
  ): Observable<LayoutPluginRender | undefined> {
    // here we have layout options inside data.options
    const options = {
      ...this.$defaultOptions(),
      ...data.options,
    };

    console.log(
      data.experience,
      !options?.showArrows,
      !options?.showIndicators
    );

    if (
      data.experience || // we have nested components
      (!options?.showArrows && !options?.showIndicators)
    ) {
      return of();
    }

    return of({
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
    });
  }

  protected $defaultOptions = signal(this.getDefaultProperties());

  /**
   * The default properties are redefined by the layout options, which can
   * be set in the experience data options or directly when using a layout
   * component.
   *
   * @returns Default properties for the carousel layout.
   */
  getDefaultProperties(): Observable<LayoutStylesOptions> {
    return of({
      showArrows: true,
      showIndicators: true,
      scrollBehavior: CarouselScrollBehavior.Smooth,
      arrowNavigationBehavior: ArrowNavigationBehavior.Slide,
      scrollWithMouse: true,
      scrollWithTouch: true,
      indicatorsAlignment: CarouselIndicatorAlignment.Center,
      indicatorsPosition: CarouselIndicatorPosition.Below,
    });
  }
}
