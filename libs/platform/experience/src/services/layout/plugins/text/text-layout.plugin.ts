import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { Observable } from 'rxjs';
import { LayoutStyles } from '../../layout.model';
import { LayoutPlugin } from '../layout.plugin';

export class TextLayoutPlugin implements LayoutPlugin {
  getStyles(): Observable<LayoutStyles> {
    return ssrAwaiter(import('./text-layout.styles').then((m) => m.styles));
  }
}
