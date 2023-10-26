import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { Observable, of } from 'rxjs';
import { LayoutStyles } from '../../../layout.model';
import { LayoutPlugin, LayoutPluginConfig } from '../../layout.plugin';

export class TextLayoutPlugin implements LayoutPlugin {
  getStyles(): Observable<LayoutStyles> {
    return ssrAwaiter(import('./text-layout.styles').then((m) => m.styles));
  }

  getConfig(): Observable<LayoutPluginConfig> {
    return of({
      schema: () => import('./text-layout.schema').then((m) => m.schema),
    });
  }
}
