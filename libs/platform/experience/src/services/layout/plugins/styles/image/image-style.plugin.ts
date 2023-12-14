import { IMAGE_FIT, IMAGE_POSITION } from '@spryker-oryx/ui';
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
      [IMAGE_FIT]?: string;
      [IMAGE_POSITION]?: string;
    } = {};

    properties[IMAGE_FIT] ??= styles.imageFit;
    properties[IMAGE_POSITION] ??= styles.imagePosition;

    return of(properties);
  }
}
