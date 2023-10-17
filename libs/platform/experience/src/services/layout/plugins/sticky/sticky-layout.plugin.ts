import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { Observable } from 'rxjs';
import { StyleProperties } from '../../../../models';
import { LayoutStyles } from '../../layout.model';
import {
  LayoutPlugin,
  LayoutPluginConfig,
  LayoutPluginStyleProperties,
} from '../layout.plugin';

export class StickyLayoutPlugin implements LayoutPlugin {
  getStyles(): Observable<LayoutStyles> {
    return ssrAwaiter(import('./sticky.styles').then((m) => m.styles));
  }

  getConfig(): LayoutPluginConfig {
    return { name: 'sticky' };
  }

  getStyleProperties(data: StyleProperties): LayoutPluginStyleProperties {
    return {
      'max-height': `calc(${data.height ?? '100vh'} - ${data.top ?? '0px'})`,
    };
  }
}
