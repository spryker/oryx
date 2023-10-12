import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { Observable } from 'rxjs';
import { LayoutStyles } from '../../layout.model';
import { LayoutPlugin } from '../layout.plugin';

export class DividerLayoutPlugin implements LayoutPlugin {
  getStyles(): Observable<LayoutStyles> {
    return ssrAwaiter(import('./divider.styles').then((m) => m.styles));
  }
}
