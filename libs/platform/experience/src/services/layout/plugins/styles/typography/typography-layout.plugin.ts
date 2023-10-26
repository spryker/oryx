import { Observable, of } from 'rxjs';
import {
  LayoutPlugin,
  LayoutPluginConfig,
  LayoutStyleParameters,
  LayoutStyleProperties,
} from '../../layout.plugin';

export class TypographyLayoutPlugin implements LayoutPlugin {
  getConfig(): Observable<LayoutPluginConfig> {
    return of({
      schema: () => import('./typography-layout.schema').then((m) => m.schema),
    });
  }

  getStyleProperties(data: LayoutStyleParameters): LayoutStyleProperties {
    if (!data.typography) return {};

    return {
      'font-size': `var(--oryx-typography-${data.typography}-size)`,
      'font-weight': `var(--oryx-typography-${data.typography}-weight)`,
      'line-height': `var(--oryx-typography-${data.typography}-line)`,
    };
  }
}
