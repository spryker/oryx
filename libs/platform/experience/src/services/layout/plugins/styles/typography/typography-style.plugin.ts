import { Observable, of } from 'rxjs';
import {
  LayoutPlugin,
  LayoutPluginConfig,
  LayoutPluginPropertiesParams,
  LayoutStyleProperties,
} from '../../layout.plugin';

export class TypographyStylePlugin implements LayoutPlugin {
  getConfig(): Observable<LayoutPluginConfig> {
    return of({
      schema: () => import('./typography-style.schema').then((m) => m.schema),
    });
  }

  getStyleProperties(
    data: LayoutPluginPropertiesParams
  ): Observable<LayoutStyleProperties> {
    const { styles } = data;

    if (!styles.typography) return of({});

    return of({
      'font-size': `var(--oryx-typography-${styles.typography}-size)`,
      'font-weight': `var(--oryx-typography-${styles.typography}-weight)`,
      'line-height': `var(--oryx-typography-${styles.typography}-line)`,
    });
  }
}
