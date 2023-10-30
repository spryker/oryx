import { Observable, of } from 'rxjs';
import {
  LayoutPlugin,
  LayoutPluginConfig,
  LayoutStyleParameters,
  LayoutStyleProperties,
} from '../../layout.plugin';

export class TypographyStylePlugin implements LayoutPlugin {
  getConfig(): Observable<LayoutPluginConfig> {
    return of({
      schema: () => import('./typography-style.schema').then((m) => m.schema),
    });
  }

  getStyleProperties(
    data: LayoutStyleParameters
  ): Observable<LayoutStyleProperties> {
    if (!data.typography) return of({});

    return of({
      'font-size': `var(--oryx-typography-${data.typography}-size)`,
      'font-weight': `var(--oryx-typography-${data.typography}-weight)`,
      'line-height': `var(--oryx-typography-${data.typography}-line)`,
    });
  }
}
