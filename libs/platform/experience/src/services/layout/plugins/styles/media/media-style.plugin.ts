import { OBJECT_FIT, OBJECT_POSITION } from '@spryker-oryx/ui';
import { Observable, of } from 'rxjs';
import {
  LayoutPlugin,
  LayoutPluginConfig,
  LayoutPluginPropertiesParams,
  LayoutStyleProperties,
} from '../../layout.plugin';

export class MediaStylePlugin implements LayoutPlugin {
  getConfig(): Observable<LayoutPluginConfig> {
    return of({
      schema: () => import('./media-style.schema').then((m) => m.schema),
    });
  }

  getStyleProperties(
    data: LayoutPluginPropertiesParams
  ): Observable<LayoutStyleProperties> {
    const { objectFit, objectPosition } = data.styles;
    const properties = {
      ...(objectFit ? { [OBJECT_FIT]: objectFit } : {}),
      ...(objectPosition ? { [OBJECT_POSITION]: objectPosition } : {}),
    };
    return of(properties);
  }
}
