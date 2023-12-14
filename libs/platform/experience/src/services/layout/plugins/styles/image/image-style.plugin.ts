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
    const { imageFit, imagePosition } = data.styles;
    const properties = {
      ...(imageFit ? { [IMAGE_FIT]: imageFit } : {}),
      ...(imagePosition ? { [IMAGE_POSITION]: imagePosition } : {}),
    };
    return of(properties);
  }
}
