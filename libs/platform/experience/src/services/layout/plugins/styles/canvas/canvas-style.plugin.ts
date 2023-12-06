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
    const properties: any = {};

    if (styles.shadow) {
      properties[
        'box-shadow'
      ] = `var(--oryx-shadow-${styles.shadow}) var(--oryx-shadow-color)`;
      properties['z-index'] = 'var(--oryx-z-index, 1)';
      properties['isolation'] = 'isolate';
    }

    if (styles.background) properties['background'] = styles.background;
    if (styles.radius) properties['border-radius'] = styles.radius;
    if (styles.border) properties['border'] = styles.border;
    if (styles.fill) properties['--oryx-fill'] = styles.fill;

    return of(properties);
  }
}
