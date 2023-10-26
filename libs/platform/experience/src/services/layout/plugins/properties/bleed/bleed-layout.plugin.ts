import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { Observable } from 'rxjs';
import { LayoutStyles } from '../../../layout.model';
import {
  LayoutPlugin,
  LayoutPluginConfig,
  LayoutPluginStyleProperties,
} from '../../layout.plugin';

export class BleedLayoutPlugin implements LayoutPlugin {
  getStyles(): Observable<LayoutStyles> {
    return ssrAwaiter(import('./bleed.styles').then((m) => m.styles));
  }

  getConfig(): LayoutPluginConfig {
    return {
      schema: () => import('./bleed-layout.schema').then((m) => m.schema),
    };
  }

  getStyleProperties(): LayoutPluginStyleProperties {
    return {
      'padding-inline': '0',
    };
  }
}
