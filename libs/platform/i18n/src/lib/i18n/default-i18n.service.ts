import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { inject } from '@spryker-oryx/di';
import {
  getI18nTextHash,
  I18nContext,
  InferI18nContext,
  toObservable,
} from '@spryker-oryx/utilities';
import { isServer } from 'lit';
import {
  finalize,
  Observable,
  ReplaySubject,
  share,
  shareReplay,
  switchMap,
  timer,
} from 'rxjs';
import { I18nString } from '../models';
import { I18nProcessor } from './i18n.processor';
import { I18nService } from './i18n.service';

export class DefaultI18nService implements I18nService {
  static CacheCleanupTimeout: number | false = isServer ? false : 1000 * 60 * 5;

  protected textCache = new Map<string, Observable<I18nString>>();

  constructor(protected processor = inject(I18nProcessor)) {}

  translate<
    T extends string | readonly string[],
    Ctx extends I18nContext = InferI18nContext<T>
  >(token: T, context?: Ctx | Observable<Ctx>): Observable<I18nString> {
    return ssrAwaiter(
      this.getCached(token, context, (context$) =>
        this.processor.interpolate(token, context$)
      )
    );
  }

  protected getCached(
    token: string | readonly string[],
    context: I18nContext | Observable<I18nContext> | undefined,
    factoryFn: (
      context: Observable<I18nContext | undefined>
    ) => Observable<I18nString>
  ): Observable<I18nString> {
    const context$ = toObservable(context).pipe(
      shareReplay({ bufferSize: 1, refCount: true })
    );

    return context$.pipe(
      switchMap((context) =>
        this.getCachedText(token, context, context$, factoryFn)
      ),
      share({
        connector: () => new ReplaySubject(1),
        resetOnRefCountZero:
          DefaultI18nService.CacheCleanupTimeout === false
            ? true
            : () => timer(DefaultI18nService.CacheCleanupTimeout as number),
      })
    );
  }

  protected getCachedText(
    token: string | readonly string[],
    context: I18nContext | undefined,
    context$: Observable<I18nContext | undefined>,
    factoryFn: (
      context: Observable<I18nContext | undefined>
    ) => Observable<I18nString>
  ): Observable<I18nString> {
    const cachedText$ = this.textCache.get(getI18nTextHash(token, context));

    if (cachedText$) {
      return cachedText$;
    }

    return this.getNewText(token, context, context$, factoryFn);
  }

  protected getNewText(
    token: string | readonly string[],
    context: I18nContext | undefined,
    context$: Observable<I18nContext | undefined>,
    factoryFn: (
      context: Observable<I18nContext | undefined>
    ) => Observable<I18nString>
  ): Observable<I18nString> {
    const hash = getI18nTextHash(token, context);

    // Check if new context is already in cache
    if (this.textCache.has(hash)) {
      return this.getCachedText(token, context, context$, factoryFn);
    }

    const text$ = factoryFn(context$);
    this.textCache.set(hash, text$);

    return text$.pipe(
      finalize(() => this.textCache.delete(hash)),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }
}
