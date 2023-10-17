import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { Observable } from 'rxjs';
import { LayoutStyles } from '../../layout.model';
import {
  LayoutPlugin,
  LayoutPluginConfig,
  LayoutPluginProperties,
} from '../layout.plugin';

export class BleedLayoutPlugin implements LayoutPlugin {
  getStyles(): Observable<LayoutStyles> {
    return ssrAwaiter(import('./bleed.styles').then((m) => m.styles));
  }

  getConfig(): LayoutPluginConfig {
    return { name: 'bleed' };
  }

  getProperties(): LayoutPluginProperties {
    return {
      'padding-inline': '0',
    };
  }
}
