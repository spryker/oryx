import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { css } from 'lit';
import { Observable, of } from 'rxjs';
import { LayoutStyles } from '../../../layout.model';
import {
  LayoutPlugin,
  LayoutPluginConfig,
  LayoutPluginOptionsParams,
} from '../../layout.plugin';

export class NavigationLayoutPlugin implements LayoutPlugin {
  getStyles(data: LayoutPluginOptionsParams): Observable<LayoutStyles> {
    const { options } = data;

    return ssrAwaiter(
      import('./navigation-layout.styles').then((m) => {
        const direction = options.vertical
          ? m.verticalStyles
          : m.horizontalStyles;

        const navigationType =
          options.navigationType === 'flyout' ? m.flyoutStyles : css``;

        return {
          styles: `${m.styles.styles}${direction}${navigationType}`,
        };
      })
    );
  }

  getConfig(): Observable<LayoutPluginConfig> {
    return of({
      schema: () => import('./navigation-layout.schema').then((m) => m.schema),
    });
  }
}
