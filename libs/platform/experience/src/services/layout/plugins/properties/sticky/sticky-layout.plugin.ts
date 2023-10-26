import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { Observable, of } from 'rxjs';
import { LayoutStyles } from '../../../layout.model';
import {
  LayoutPlugin,
  LayoutPluginConfig,
  LayoutStyleParameters,
  LayoutStyleProperties,
} from '../../layout.plugin';

export class StickyLayoutPlugin implements LayoutPlugin {
  getStyles(): Observable<LayoutStyles> {
    return ssrAwaiter(import('./sticky.styles').then((m) => m.styles));
  }

  getConfig(): Observable<LayoutPluginConfig> {
    return of({
      schema: () => import('./sticky-layout.schema').then((m) => m.schema),
    });
  }

  getStyleProperties(data: LayoutStyleParameters): LayoutStyleProperties {
    return {
      'max-height': `calc(${data.height ?? '100vh'} - ${data.top ?? '0px'})`,
    };
  }
}
