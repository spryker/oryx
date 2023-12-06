import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { Observable, map, of } from 'rxjs';
import { LayoutStyles, LayoutStylesOptions } from '../../../layout.model';
import {
  LayoutPlugin,
  LayoutPluginConfig,
  LayoutPluginOptionsParams,
  LayoutPluginPropertiesParams,
  LayoutStyleProperties,
} from '../../layout.plugin';

export class FlexLayoutPlugin implements LayoutPlugin {
  /**
   * @override adds a `flex-wrap: wrap` when the layout option wrap is set to true.
   */
  getStyleProperties(
    data: LayoutPluginPropertiesParams
  ): Observable<LayoutStyleProperties> {
    return this.getDefaultProperties().pipe(
      map((defaultOptions) => {
        const options = { ...defaultOptions, ...data.options };
        return options.wrap ? { 'flex-wrap': 'wrap' } : {};
      })
    );
  }

  getStyles(data: LayoutPluginOptionsParams): Observable<LayoutStyles> {
    const { options } = data;

    return ssrAwaiter(
      import('./flex-layout.styles').then((m) => {
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
      schema: () => import('./flex-layout.schema').then((m) => m.schema),
    });
  }

  /**
   * The default properties are redefined by the layout options, which can
   * be set in the experience data options or directly when using a layout
   * component.
   *
   * @returns Default properties for the flex layout.
   */
  getDefaultProperties(): Observable<LayoutStylesOptions> {
    return of({
      wrap: true,
    });
  }
}
