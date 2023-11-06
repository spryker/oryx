import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { Observable, of } from 'rxjs';
import { LayoutStyles } from '../../../layout.model';
import {
  LayoutPlugin,
  LayoutPluginConfig,
  LayoutPluginPropertiesParams,
  LayoutStyleProperties,
} from '../../layout.plugin';

export class SplitLayoutPlugin implements LayoutPlugin {
  getStyles(): Observable<LayoutStyles> {
    return ssrAwaiter(import('./split-layout.styles').then((m) => m.styles));
  }

  getStyleProperties(
    data: LayoutPluginPropertiesParams
  ): Observable<LayoutStyleProperties> {
    const { columnWidthType } = data.styles.layout ?? {};

    if (columnWidthType) {
      return of({ '--split': `var(--oryx-column-split-${columnWidthType})` });
    }

    return of();
  }

  getConfig(): Observable<LayoutPluginConfig> {
    return of({
      schema: () => import('./split-layout.schema').then((m) => m.schema),
    });
  }
}
