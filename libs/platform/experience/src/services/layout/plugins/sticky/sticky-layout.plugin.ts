import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { Observable } from 'rxjs';
import { LayoutStyles } from '../../layout.model';
import {
  LayoutPlugin,
  LayoutPluginConfig,
  LayoutPluginStyleProperties,
  LayoutStyleProperties,
} from '../layout.plugin';

export class StickyLayoutPlugin implements LayoutPlugin {
  getStyles(): Observable<LayoutStyles> {
    return ssrAwaiter(import('./sticky.styles').then((m) => m.styles));
  }

  getConfig(): LayoutPluginConfig {
    return {
      schema: () => import('./sticky-layout.schema').then((m) => m.schema),
    };
  }

  getStyleProperties(data: LayoutStyleProperties): LayoutPluginStyleProperties {
    return {
      'max-height': `calc(${data.height ?? '100vh'} - ${data.top ?? '0px'})`,
    };
  }
}
