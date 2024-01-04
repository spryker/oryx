import { Observable, of } from 'rxjs';
import {
  LayoutPlugin,
  LayoutPluginConfig,
  LayoutPluginPropertiesParams,
  LayoutStyleProperties,
  LayoutStylePropertiesArr,
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
    const properties: LayoutStylePropertiesArr = [];

    if (styles.shadow) {
      properties.push([
        {
          'box-shadow': `var(--oryx-shadow-${styles.shadow}) var(--oryx-shadow-color)`,
        },
      ]);
    }

    if (styles.background) properties.push([{ background: styles.background }]);
    if (styles.radius) properties.push([{ 'border-radius': styles.radius }]);
    if (styles.border) properties.push([{ border: styles.border }]);
    if (styles.fill) properties.push([{ '--oryx-fill': styles.fill }]);
    if (styles.zIndex) {
      properties.push([{ 'z-index': styles.zIndex }, { omitUnit: true }]);
      properties.push([
        { '--oryx-z-index': styles.zIndex },
        { omitUnit: true },
      ]);
    }
    return of(properties);
  }
}
