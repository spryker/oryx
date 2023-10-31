import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { Observable, of } from 'rxjs';
import { LayoutStyles } from '../../../layout.model';
import { LayoutPlugin, LayoutPluginConfig } from '../../layout.plugin';

export class GridLayoutPlugin implements LayoutPlugin {
  getStyles(): Observable<LayoutStyles> {
    return ssrAwaiter(import('./grid-layout.styles').then((m) => m.styles));
  }

  getConfig(): Observable<LayoutPluginConfig> {
    return of({
      schema: () => import('./grid-layout.schema').then((m) => m.schema),
    });
  }
}