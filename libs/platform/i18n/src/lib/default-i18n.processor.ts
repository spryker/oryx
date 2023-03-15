import { inject } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/site';
import { DefaultI18nInjectable, I18nContext } from '@spryker-oryx/utilities';
import {
  combineLatest,
  distinctUntilChanged,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
} from 'rxjs';
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
        console.log('data', data);
        await this.globalizeService.loadMessages(data);
        console.log('loaded');

        return localeId;
      }),
      shareReplay(1)
    );
  }

  interpolate(
    token: string | readonly string[],
    context: Observable<I18nContext | undefined>
  ): Observable<string> {
    return combineLatest([this.localeId$, context]).pipe(
      switchMap(([localeId, ctx]) => this.resolveToken(token, ctx, localeId)),
      switchMap((text) =>
        text ? of(text) : this.fallbackInterpolate(token, context)
      )
    );
  }

  protected fallbackInterpolate(
    token: string | readonly string[],
    context: Observable<I18nContext | undefined>
  ): Observable<string> {
    return context.pipe(
      map((ctx) => this.i18nInjectable.translate(token, ctx))
    );
  }

  protected async resolveToken(
    tokens: string | readonly string[],
    context: I18nContext | undefined,
    localeId: string
  ): Promise<string | undefined> {
    if (typeof tokens === 'string') {
      tokens = [tokens];
    }

    for (const token of tokens) {
      const msg = await this.resolveTokenPieces(token, context, localeId);

      if (msg !== undefined) {
        return msg;
      }
    }

    return;
  }

  protected async resolveTokenPieces(
    token: string,
    context: I18nContext | undefined = {},
    localeId: string
  ): Promise<string | undefined> {
    let tokenPart = token;
    let nextDotIdx = -1; // Start from full token with -1 offset

    do {
      tokenPart = tokenPart.slice(nextDotIdx + 1);

      console.log('tokenPart', tokenPart, this.globalizeService);

      (global as any).oryxGlobalize = this.globalizeService;

      const msg = await this.globalizeService.formatMessage(
        localeId,
        tokenPart,
        context
      );

      console.log('msg', msg);

      if (msg !== undefined) {
        return msg;
      }
    } while ((nextDotIdx = tokenPart.indexOf('.')) !== -1);

    return;
  }
}
