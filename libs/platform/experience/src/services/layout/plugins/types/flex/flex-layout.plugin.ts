import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { signal } from '@spryker-oryx/utilities';
import { Observable, of } from 'rxjs';
import { LayoutStyles, LayoutStylesOptions } from '../../../layout.model';
import {
  LayoutPlugin,
  LayoutPluginConfig,
  LayoutPluginOptionsParams,
  LayoutPluginPropertiesParams,
  LayoutStyleProperties,
} from '../../layout.plugin';

export class FlexLayoutPlugin implements LayoutPlugin {
  getStyleProperties(
    data: LayoutPluginPropertiesParams
  ): Observable<LayoutStyleProperties> {
    const options = { ...this.$defaultOptions(), ...data.options };
    const props: LayoutStyleProperties = {};
    if (options.wrap) {
      props['flex-wrap'] = 'wrap';
    }

    return of(props);
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

  protected $defaultOptions = signal(this.getDefaultProperties());

  /**
   * The default properties are redefined by the layout options, which can
   * be set in the experience data options or directly when using a layout
   * component.
   *
   * @returns Default properties for the flex layout.
   */
  getDefaultProperties(): Observable<LayoutStylesOptions> {
    return of({
      wrap: false,
    });
  }
}
