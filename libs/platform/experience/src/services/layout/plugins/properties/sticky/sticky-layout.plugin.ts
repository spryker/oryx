import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { Observable, of } from 'rxjs';
import { LayoutStyles } from '../../../layout.model';
import {
  LayoutPlugin,
  LayoutPluginConfig,
  LayoutPluginPropertiesParams,
  LayoutStyleProperties,
} from '../../layout.plugin';

export class StickyLayoutPlugin implements LayoutPlugin {
  getStyles(): Observable<LayoutStyles> {
    return ssrAwaiter(import('./sticky.styles').then((m) => m.styles));
  }

  getConfig(): Observable<LayoutPluginConfig> {
    return of({
      schema: () => import('./sticky-layout.schema').then((m) => m.schema),
    });
  }

  getStyleProperties(
    data: LayoutPluginPropertiesParams
  ): Observable<LayoutStyleProperties> {
    const { styles } = data;

    return of([
      [
        {
          'max-height': `calc(${styles.height ?? '100vh'} - ${
            styles.top ?? '0px'
          })`,
          overflow: styles.overflow,
        },
      ],
      [{ 'z-index': styles.zIndex }, { omitUnit: true }],
    ]);
  }
}
