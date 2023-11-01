import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { Observable, map, of } from 'rxjs';
import { LayoutStyles } from '../../../layout.model';
import {
  LayoutPlugin,
  LayoutPluginConfig,
  LayoutPluginOptionsParams,
} from '../../layout.plugin';

export class CarouselLayoutPlugin implements LayoutPlugin {
  getStyles(data: LayoutPluginOptionsParams): Observable<LayoutStyles> {
    const { options } = data;

    return ssrAwaiter(import('./carousel-layout.styles')).pipe(
      map((m) => {
        if (!options.vertical) return m.styles;

        return {
          ...m.styles,
          styles: `${m.styles.styles}${m.verticalStyles.styles}`,
        };
      })
    );
  }

  getConfig(): Observable<LayoutPluginConfig> {
    return of({
      schema: () => import('./carousel-layout.schema').then((m) => m.schema),
    });
  }
}
