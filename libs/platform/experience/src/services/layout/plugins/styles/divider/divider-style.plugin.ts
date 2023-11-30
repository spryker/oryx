import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { Observable, of } from 'rxjs';
import { LayoutStyles } from '../../../layout.model';
import {
  LayoutPlugin,
  LayoutPluginConfig,
  LayoutPluginOptionsParams,
  LayoutPluginPropertiesParams,
  LayoutStyleProperties,
} from '../../layout.plugin';

export class DividerStylePlugin implements LayoutPlugin {
  getConfig(): Observable<LayoutPluginConfig> {
    return of({
      schema: () => import('./divider-style.schema').then((m) => m.schema),
    });
  }

  getStyles(data: LayoutPluginOptionsParams): Observable<LayoutStyles> {
    const { options } = data;
    console.log('divider getStyles', data, options);
    return ssrAwaiter(
      import('./divider.styles').then((m) => {
        return {
          ...m.styles,
        };
      })
    );
  }

  getStyleProperties(
    data: LayoutPluginPropertiesParams
  ): Observable<LayoutStyleProperties> {
    const { styles } = data;

    if (styles.divider) {
      // console.log(data);
      return of({
        // display: 'block',
        // 'background-color': `red`,
        // outline: `solid 5px red`,
        'border-top':
          'solid 1px var(--oryx-color-divider, var(--oryx-color-neutral-6))',
      });
    }
    return of();
  }
}
