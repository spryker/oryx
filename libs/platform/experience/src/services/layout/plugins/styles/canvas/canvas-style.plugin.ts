import { Observable, of } from 'rxjs';
import {
  LayoutPlugin,
  LayoutPluginConfig,
  LayoutPluginPropertiesParams,
  LayoutStyleProperties,
} from '../../layout.plugin';

export class CanvasStylePlugin implements LayoutPlugin {
  getConfig(): Observable<LayoutPluginConfig> {
    return of({
      schema: () => import('./canvas-style.schema').then((m) => m.schema),
    });
  }

  getStyleProperties(
    data: LayoutPluginPropertiesParams
  ): Observable<LayoutStyleProperties> {
    const { styles } = data;

    return of({
      border: styles.border,
      'border-radius': styles.radius,
      background: styles.background,
      '--oryx-fill': styles.fill,
    });
  }
}
