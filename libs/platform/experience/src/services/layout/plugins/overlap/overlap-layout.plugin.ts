import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { Observable } from 'rxjs';
import { LayoutStyles } from '../../layout.model';
import { LayoutPlugin, LayoutPluginConfig } from '../layout.plugin';

export class OverlapLayoutPlugin implements LayoutPlugin {
  getStyles(): Observable<LayoutStyles> {
    return ssrAwaiter(import('./overlap.styles').then((m) => m.styles));
  }

  getConfig(): LayoutPluginConfig {
    return { name: 'overlap' };
  }
}
