import { Observable, of } from 'rxjs';
import { findCssValue, findCssValues } from '../../../layout-styles.utilities';
import {
  LayoutPlugin,
  LayoutPluginConfig,
  LayoutStyleParameters,
  LayoutStyleProperties,
} from '../../layout.plugin';

export class SpacingStylePlugin implements LayoutPlugin {
  getConfig(): Observable<LayoutPluginConfig> {
    return of({
      schema: () => import('./spacing-style.schema').then((m) => m.schema),
    });
  }

  getStyleProperties(
    data: LayoutStyleParameters
  ): Observable<LayoutStyleProperties> {
    return of({
      margin: data.margin,
      'inset-block-start': data.top,
      height: data.height,
      width: data.width,
      'aspect-ratio': data.ratio,
      ...(data.padding
        ? {
            'scroll-padding': findCssValue(data.padding, 'start'),
            'padding-block': findCssValues(data.padding, 'top', 'bottom'),
            'padding-inline': findCssValues(data.padding, 'start', 'end'),
            '--inline-padding': findCssValues(data.padding, 'start', 'end'),
          }
        : {}),
    });
  }
}
