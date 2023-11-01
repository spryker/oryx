import { Observable, of } from 'rxjs';
import { findCssValue, findCssValues } from '../../../layout-styles.utilities';
import {
  LayoutPlugin,
  LayoutPluginConfig,
  LayoutPluginPropertiesParams,
  LayoutStyleProperties,
} from '../../layout.plugin';

export class SpacingStylePlugin implements LayoutPlugin {
  getConfig(): Observable<LayoutPluginConfig> {
    return of({
      schema: () => import('./spacing-style.schema').then((m) => m.schema),
    });
  }

  getStyleProperties(
    data: LayoutPluginPropertiesParams
  ): Observable<LayoutStyleProperties> {
    const { styles } = data;

    return of({
      margin: styles.margin,
      'inset-block-start': styles.top,
      height: styles.height,
      width: styles.width,
      'aspect-ratio': styles.ratio,
      ...(styles.padding
        ? {
            'scroll-padding': findCssValue(styles.padding, 'start'),
            'padding-block': findCssValues(styles.padding, 'top', 'bottom'),
            'padding-inline': findCssValues(styles.padding, 'start', 'end'),
            '--inline-padding': findCssValues(styles.padding, 'start', 'end'),
          }
        : {}),
    });
  }
}
