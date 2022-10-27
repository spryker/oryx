import { inject } from '@spryker-oryx/injector';
import { BehaviorSubject, filter, map, Observable, of, switchMap } from 'rxjs';
import { Locale } from '../../models';
import { StoreService } from '../store';
import { LocaleService } from './locale.service';

export class DefaultLocaleService implements LocaleService {
  private active$ = new BehaviorSubject<string | null>(null);

  constructor(protected storeService = inject(StoreService)) {}

  getAll(): Observable<Locale[]> {
    return this.storeService.get().pipe(
      filter(<Store>(response: Store | null): response is Store => !!response),
      map((response) => response.locales)
    );
  }

  get(): Observable<string> {
    return this.active$.pipe(
      switchMap((active) =>
        active
          ? of(active)
          : this.getAll().pipe(map((locales) => locales?.[0].name))
      )
    );
  }

  set(value: string): void {
    this.active$.next(value);
  }
}
