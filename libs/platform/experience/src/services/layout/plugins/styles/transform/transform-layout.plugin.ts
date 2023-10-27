import { Observable, of } from 'rxjs';
import {
  LayoutPlugin,
  LayoutPluginConfig,
  LayoutStyleParameters,
  LayoutStyleProperties,
} from '../../layout.plugin';

export class TransformLayoutPlugin implements LayoutPlugin {
  getConfig(): Observable<LayoutPluginConfig> {
    return of({
      schema: () => import('./transform-layout.schema').then((m) => m.schema),
    });
  }

  getStyleProperties(
    data: LayoutStyleParameters
  ): Observable<LayoutStyleProperties> {
    return of([
      [{ rotate: data.rotate }, { unit: 'deg' }],
      [{ scale: data.scale }],
    ]);
  }
}
