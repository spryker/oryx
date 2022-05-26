import { BehaviorSubject } from 'rxjs';
import { LocaleService } from './locale.service';

export class DefaultLocaleService implements LocaleService {
  private locales$ = new BehaviorSubject<string[]>(['de-DE', 'en-US']);
  private active$ = new BehaviorSubject('de-DE');

  getAll() {
    return this.locales$;
  }

  get() {
    return this.active$;
  }

  set(value: string): void {
    this.active$.next(value);
  }
}
