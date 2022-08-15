import { BehaviorSubject, Observable } from 'rxjs';
import { CurrencyService } from './currency.service';

export class DefaultCurrencyService implements CurrencyService {
  private currencies$ = new BehaviorSubject<string[]>(['USD', 'EUR']);
  private active$ = new BehaviorSubject('EUR');

  getAll(): Observable<string[]> {
    return this.currencies$;
  }

  get(): Observable<string> {
    return this.active$;
  }

  set(value: string): void {
    this.active$.next(value);
  }
}
