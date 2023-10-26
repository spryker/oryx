import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { Observable, of } from 'rxjs';
import { LayoutStyles } from '../../../layout.model';
import { LayoutPlugin, LayoutPluginConfig } from '../../layout.plugin';

export class SplitAsideLayoutPlugin implements LayoutPlugin {
  getStyles(): Observable<LayoutStyles> {
    return ssrAwaiter(
      import('./split-aside-layout.styles').then((m) => m.styles)
    );
  }

  getConfig(): Observable<LayoutPluginConfig> {
    return of({
      schema: () => import('./split-aside-layout.schema').then((m) => m.schema),
    });
  }
}
