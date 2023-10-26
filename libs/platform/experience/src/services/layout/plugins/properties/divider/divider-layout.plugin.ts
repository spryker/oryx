import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { Observable } from 'rxjs';
import { LayoutStyles } from '../../../layout.model';
import { LayoutPlugin, LayoutPluginConfig } from '../../layout.plugin';

export class DividerLayoutPlugin implements LayoutPlugin {
  getStyles(): Observable<LayoutStyles> {
    return ssrAwaiter(import('./divider.styles').then((m) => m.styles));
  }

  getConfig(): LayoutPluginConfig {
    return {
      schema: () => import('./divider-layout.schema').then((m) => m.schema),
    };
  }
}
