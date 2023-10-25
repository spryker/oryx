import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { Observable } from 'rxjs';
import { LayoutStyles } from '../../layout.model';
import { LayoutPlugin, LayoutPluginConfig } from '../layout.plugin';

export class SplitMainLayoutPlugin implements LayoutPlugin {
  getStyles(): Observable<LayoutStyles> {
    return ssrAwaiter(
      import('./split-main-layout.styles').then((m) => m.styles)
    );
  }

  getConfig(): LayoutPluginConfig {
    return {
      schema: () => import('./split-main-layout.schema').then((m) => m.schema),
    };
  }
}
