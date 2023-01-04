import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { inject } from '@spryker-oryx/di';
import { I18nContext, InferI18nContext } from '@spryker-oryx/utilities';
import { isObservable, Observable, of, shareReplay } from 'rxjs';
import { I18nProcessor } from './i18n.processor';
import { I18nService } from './i18n.service';

export class DefaultI18nService implements I18nService {
  constructor(protected processor = inject(I18nProcessor)) {}

  translate<
    T extends string | readonly string[],
    Ctx extends I18nContext = InferI18nContext<T>
  >(token: T, context?: Ctx | Observable<Ctx>): Observable<string> {
    return ssrAwaiter(
      this.processor
        .interpolate(token, this.normalizeContext(context))
        .pipe(shareReplay({ refCount: true, bufferSize: 1 }))
    );
  }

  protected normalizeContext(
    context?: I18nContext | Observable<I18nContext>
  ): Observable<I18nContext | undefined> {
    return isObservable(context) ? context : of(context);
  }
}
