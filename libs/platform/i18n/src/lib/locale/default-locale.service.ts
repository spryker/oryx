import { QueryService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import {
  concat,
  distinctUntilChanged,
  map,
  Observable,
  ReplaySubject,
  shareReplay,
  takeUntil,
} from 'rxjs';
import { Locale } from '../models';
import { DefaultLocaleAdapter, LocaleAdapter } from './adapter';
import { LocaleService } from './locale.service';
import { LocaleChanged } from './state';

export class DefaultLocaleService implements LocaleService {
  protected setActive$ = new ReplaySubject<string>(1);
  protected active$;
  protected all$;

  constructor(
    protected adapter = inject(LocaleAdapter, null) ??
      new DefaultLocaleAdapter(),
    protected queryService = inject(QueryService)
  ) {
    this.active$ = concat(
      this.adapter.getDefault().pipe(takeUntil(this.setActive$)),
      this.setActive$
    ).pipe(
      distinctUntilChanged(),
      map((locale, i) => {
        // Use map to access index and emit LocaleChanged only after first value
        if (i !== 0) {
          this.queryService.emit({ type: LocaleChanged, data: locale });
        }

        return locale;
      }),
      shareReplay({ refCount: true, bufferSize: 1 })
    );

    this.all$ = this.adapter
      .getAll()
      .pipe(shareReplay({ refCount: true, bufferSize: 1 }));
  }

  getAll(): Observable<Locale[]> {
    return this.all$;
  }

  get(): Observable<string> {
    return this.active$;
  }

  set(value: string): void {
    this.setActive$.next(value);
  }

  formatDate(stamp: string | number): Observable<string> {
    return this.get().pipe(
      map((locale) =>
        Intl.DateTimeFormat(locale.replace('_', '-')).format(new Date(stamp))
      )
    );
  }

  formatTime(stamp: string | number | Date): Observable<string> {
    return this.get().pipe(
      map((locale) =>
        Intl.DateTimeFormat(locale.replace('_', '-'), {
          hour: '2-digit',
          minute: '2-digit',
        }).format(stamp instanceof Date ? stamp : new Date(stamp))
      )
    );
  }

  formatDateTime(stamp: string | number | Date): Observable<string> {
    return this.get().pipe(
      map((locale) =>
        Intl.DateTimeFormat(locale.replace('_', '-'), {
          hour: '2-digit',
          minute: '2-digit',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }).format(stamp instanceof Date ? stamp : new Date(stamp))
      )
    );
  }
}
