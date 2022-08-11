import { BehaviorSubject, Observable } from 'rxjs';
import { LocaleService } from './locale.service';

export class DefaultLocaleService implements LocaleService {
  private locales$ = new BehaviorSubject<string[]>(['de-DE', 'en-US']);
  private active$ = new BehaviorSubject('de-DE');

  getAll(): Observable<string[]> {
    return this.locales$;
  }

  get(): Observable<string> {
    return this.active$;
  }

  set(value: string): void {
    this.active$.next(value);
  }
}
