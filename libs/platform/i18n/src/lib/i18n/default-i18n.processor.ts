import { inject } from '@spryker-oryx/di';
import { DefaultI18nInjectable, I18nContext } from '@spryker-oryx/utilities';
import {
  Observable,
  combineLatest,
  distinctUntilChanged,
  shareReplay,
  switchMap,
} from 'rxjs';
import { LocaleService } from '../locale';
import { I18nString } from '../models';
import { GlobalizeService } from './globalize.service';
import { I18nLoader } from './i18n.loader';
import { I18nProcessor } from './i18n.processor';

export class DefaultI18nProcessor implements I18nProcessor {
  protected localeId$: Observable<string>;

  constructor(
    protected localeService = inject(LocaleService),
    protected loader = inject(I18nLoader),
    protected globalizeService = inject(GlobalizeService),
    protected i18nInjectable = new DefaultI18nInjectable()
  ) {
    this.localeId$ = this.localeService.get().pipe(
      distinctUntilChanged(),
      switchMap(async (localeId) => {
        const data = await this.loader.load(localeId);

        await this.globalizeService.loadMessages(data);

        return localeId;
      }),
      shareReplay(1)
    );
  }

  interpolate(
    token: string | readonly string[],
    context: Observable<I18nContext | undefined>
  ): Observable<I18nString> {
    return combineLatest([this.localeId$, context]).pipe(
      switchMap(
        async ([localeId, ctx]) =>
          (await this.resolveToken(token, localeId, ctx)) ??
          this.fallbackInterpolate(token, ctx)
      )
    );
  }

  protected fallbackInterpolate(
    token: string | readonly string[],
    context?: I18nContext
  ): I18nString {
    const result = this.i18nInjectable.translate(token, context);

    if (typeof result === 'string') {
      return result;
    }

    if ('text' in result) {
      if (result.hasHtml) {
        return this.createHtmlString(result.text);
      } else {
        return String(result.text);
      }
    }

    return String(result);
  }

  protected async resolveToken(
    tokens: string | readonly string[],
    localeId: string,
    context?: I18nContext
  ): Promise<I18nString | undefined> {
    if (typeof tokens === 'string') {
      tokens = [tokens];
    }

    for (const token of tokens) {
      const msg = await this.resolveTokenPieces(token, localeId, context);

      if (msg !== undefined) {
        const hasHtml = this.i18nInjectable.hasHtml(token, context);

        if (hasHtml) {
          return this.createHtmlString(msg);
        }

        return msg;
      }
    }

    return;
  }

  protected async resolveTokenPieces(
    token: string,
    localeId: string,
    context?: I18nContext
  ): Promise<string | undefined> {
    let tokenPart = token;
    let nextDotIdx = -1; // Start from full token with -1 offset

    do {
      tokenPart = tokenPart.slice(nextDotIdx + 1);

      const msg = await this.globalizeService.formatMessage(
        localeId,
        tokenPart,
        context
      );

      if (msg !== undefined) {
        return msg;
      }
    } while ((nextDotIdx = tokenPart.indexOf('.')) !== -1);

    return;
  }

  protected createHtmlString(value: unknown): I18nString {
    const i18nString = new String(value) as I18nString;
    i18nString.hasHtml = true;

    return i18nString;
  }
}
