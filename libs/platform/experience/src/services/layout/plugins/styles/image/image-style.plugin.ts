import { Observable, of } from 'rxjs';
import {
  LayoutPlugin,
  LayoutPluginConfig,
  LayoutPluginPropertiesParams,
  LayoutStyleProperties,
} from '../../layout.plugin';

export class ImageStylePlugin implements LayoutPlugin {
  getConfig(): Observable<LayoutPluginConfig> {
    return of({
      schema: () => import('./image-style.schema').then((m) => m.schema),
    });
  }

  getStyleProperties(
    data: LayoutPluginPropertiesParams
  ): Observable<LayoutStyleProperties> {
    const { styles } = data;

    const properties: {
      '--image-fit'?: string;
      '--image-position'?: string;
    } = {};

    properties['--image-fit'] ??= styles.imageFit;
    properties['--image-position'] ??= styles.imagePosition;

    return of(properties);
  }
}
