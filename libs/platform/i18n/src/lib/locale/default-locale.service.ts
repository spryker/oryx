import { QueryService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { isDefined } from '@spryker-oryx/utilities';
import {
  BehaviorSubject,
  concat,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  shareReplay,
  skip,
  takeUntil,
} from 'rxjs';
import { Locale } from '../models';
import { DefaultLocaleAdapter, LocaleAdapter } from './adapter';
import { LocaleService } from './locale.service';
import { LocaleChanged } from './state';

export class DefaultLocaleService implements LocaleService {
  protected setActive$ = new BehaviorSubject<string | null>(null);
  protected active$;
  protected all$;
  protected dateFormat$: Observable<Intl.DateTimeFormat>;
  protected timeFormat$: Observable<Intl.DateTimeFormat>;
  protected dateTimeFormat$: Observable<Intl.DateTimeFormat>;
  protected weekDayFormat$: Observable<Intl.DateTimeFormat>;

  constructor(
    protected adapter = inject(LocaleAdapter, null) ??
      new DefaultLocaleAdapter(),
    protected queryService = inject(QueryService)
  ) {
    this.active$ = concat(
      this.adapter.getDefault().pipe(takeUntil(this.setActive$.pipe(skip(1)))),
      this.setActive$
    ).pipe(
      filter(isDefined),
      distinctUntilChanged(),
      shareReplay({ refCount: true, bufferSize: 1 })
    );

    this.all$ = this.adapter
      .getAll()
      .pipe(shareReplay({ refCount: true, bufferSize: 1 }));

    this.dateFormat$ = this.get().pipe(
      map((locale) => Intl.DateTimeFormat(locale.replace('_', '-'))),
      shareReplay({ refCount: true, bufferSize: 1 })
    );

    this.timeFormat$ = this.get().pipe(
      map((locale) =>
        Intl.DateTimeFormat(locale.replace('_', '-'), {
          hour: '2-digit',
          minute: '2-digit',
        })
      ),
      shareReplay({ refCount: true, bufferSize: 1 })
    );

    this.dateTimeFormat$ = this.get().pipe(
      map((locale) =>
        Intl.DateTimeFormat(locale.replace('_', '-'), {
          hour: '2-digit',
          minute: '2-digit',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      ),
      shareReplay({ refCount: true, bufferSize: 1 })
    );

    this.weekDayFormat$ = this.get().pipe(
      map((locale) =>
        Intl.DateTimeFormat(locale.replace('_', '-'), {
          weekday: 'long',
          timeZone: 'UTC',
        })
      ),
      shareReplay({ refCount: true, bufferSize: 1 })
    );
  }

  getAll(): Observable<Locale[]> {
    return this.all$;
  }

  get(): Observable<string> {
    return this.active$;
  }

  set(value: string): void {
    const prev = this.setActive$.value;
    this.setActive$.next(value);

    if (prev !== value) {
      this.queryService.emit({ type: LocaleChanged, data: value });
    }
  }

  formatDate(stamp: string | number | Date): Observable<string> {
    return this.dateFormat$.pipe(
      map((dateFormat) =>
        dateFormat.format(stamp instanceof Date ? stamp : new Date(stamp))
      )
    );
  }

  formatTime(stamp: string | number | Date): Observable<string> {
    return this.timeFormat$.pipe(
      map((timeFormat) =>
        timeFormat.format(stamp instanceof Date ? stamp : new Date(stamp))
      )
    );
  }

  formatDateTime(stamp: string | number | Date): Observable<string> {
    return this.dateTimeFormat$.pipe(
      map((dateTimeFormat) =>
        dateTimeFormat.format(stamp instanceof Date ? stamp : new Date(stamp))
      )
    );
  }

  formatDay(dayName: string): Observable<string> {
    return this.weekDayFormat$.pipe(
      map((formatter) => {
        const date = new Date();
        const now = date.getDay();
        const days = [
          'sunday',
          'monday',
          'tuesday',
          'wednesday',
          'thursday',
          'friday',
          'saturday',
        ];
        const day = days.indexOf(dayName.toLowerCase());

        let diff = day - now;
        diff = diff < 1 ? 7 + diff : diff;

        return formatter.format(date.setDate(date.getDate() + diff));
      })
    );
  }
}
