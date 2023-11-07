import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { Observable, of } from 'rxjs';
import { LayoutStyles } from '../../../layout.model';
import {
  LayoutPlugin,
  LayoutPluginConfig,
  LayoutStyleProperties,
} from '../../layout.plugin';

export class BleedLayoutPlugin implements LayoutPlugin {
  getStyles(): Observable<LayoutStyles> {
    return ssrAwaiter(import('./bleed.styles').then((m) => m.styles));
  }

  getConfig(): Observable<LayoutPluginConfig> {
    return of({
      schema: () => import('./bleed-layout.schema').then((m) => m.schema),
    });
  }

  getStyleProperties(): Observable<LayoutStyleProperties> {
    return of({ 'padding-inline': '0' });
  }
}
