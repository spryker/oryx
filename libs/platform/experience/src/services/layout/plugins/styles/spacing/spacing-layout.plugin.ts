import { Observable, of } from 'rxjs';
import { findCssValue, findCssValues } from '../../../layout-styles.utilities';
import {
  LayoutPlugin,
  LayoutPluginConfig,
  LayoutStyleParameters,
  LayoutStyleProperties,
} from '../../layout.plugin';

export class SpacingLayoutPlugin implements LayoutPlugin {
  getConfig(): Observable<LayoutPluginConfig> {
    return of({
      schema: () => import('./spacing-layout.schema').then((m) => m.schema),
    });
  }

  getStyleProperties(data: LayoutStyleParameters): LayoutStyleProperties {
    const properties: LayoutStyleProperties = [
      [
        {
          margin: data.margin,
          'inset-block-start': data.top,
          height: data.height,
          width: data.width,
        },
      ],
    ];

    if (data.padding) {
      properties.push([
        {
          'scroll-padding': findCssValue(data.padding, 'start'),
          'padding-block': findCssValues(data.padding, 'top', 'bottom'),
          'padding-inline': findCssValues(data.padding, 'start', 'end'),
          '--inline-padding': findCssValues(data.padding, 'start', 'end'),
        },
      ]);
    }

    return properties;
  }
}
