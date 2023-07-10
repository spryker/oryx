import { DefaultI18nInjectable } from '@spryker-oryx/utilities';
import {
  BehaviorSubject,
  EMPTY,
  firstValueFrom,
  of,
  shareReplay,
  Subject,
} from 'rxjs';
import { LocaleService } from '../locale';
import { I18nString } from '../models';
import { DefaultI18nProcessor } from './default-i18n.processor';
import { GlobalizeService } from './globalize.service';
import { I18nLoader } from './i18n.loader';

describe('DefaultI18nProcessor', () => {
  class MockLocaleService implements Pick<LocaleService, 'get'> {
    get = vi.fn().mockReturnValue(EMPTY);
    asReal(): LocaleService {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return this as any;
    }
  }

  class MockI18nLoader implements I18nLoader {
    load = vi.fn();
  }

  class MockGlobalizeService
    implements Pick<GlobalizeService, 'formatMessage' | 'loadMessages'>
  {
    formatMessage = vi.fn();
    loadMessages = vi.fn();
    asReal(): GlobalizeService {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return this as any;
    }
  }

  class MockI18nInjectable implements Pick<DefaultI18nInjectable, 'translate'> {
    translate = vi.fn().mockReturnValue('mock-translation');
    hasHtml = vi.fn().mockReturnValue(false);
    asReal(): DefaultI18nInjectable {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return this as any;
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  function setup() {
    const localeService = new MockLocaleService();
    const i18nLoader = new MockI18nLoader();
    const globalizeService = new MockGlobalizeService();
    const i18nInjectable = new MockI18nInjectable();

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const createI18nProcessor = () =>
      new DefaultI18nProcessor(
        localeService.asReal(),
        i18nLoader,
        globalizeService.asReal(),
        i18nInjectable.asReal()
      );

    return {
      createI18nProcessor,
      localeService,
      i18nLoader,
      globalizeService,
      i18nInjectable,
    };
  }

  describe('interpolate() method', () => {
    it('should load locale data from loader into globalize whenever locale changes', async () => {
      const {
        createI18nProcessor,
        localeService,
        i18nLoader,
        globalizeService,
      } = setup();
      const localeId$ = new Subject<string>();
      localeService.get.mockReturnValue(localeId$);
      i18nLoader.load.mockResolvedValue('mock-locale-data');
      globalizeService.loadMessages.mockResolvedValue(undefined);

      const res$ = createI18nProcessor().interpolate('token', of(undefined));
      const sub = res$.subscribe(); // Initiate streams

      localeId$.next('mock-locale-id');

      await firstValueFrom(res$);

      expect(localeService.get).toHaveBeenCalledTimes(1);
      expect(i18nLoader.load).toHaveBeenCalledTimes(1);
      expect(i18nLoader.load).toHaveBeenCalledWith('mock-locale-id');
      expect(globalizeService.loadMessages).toHaveBeenCalledTimes(1);
      expect(globalizeService.loadMessages).toHaveBeenCalledWith(
        'mock-locale-data'
      );

      localeId$.next('new-mock-locale-id');

      await firstValueFrom(res$);

      expect(localeService.get).toHaveBeenCalledTimes(1);
      expect(i18nLoader.load).toHaveBeenCalledTimes(2);
      expect(i18nLoader.load).toHaveBeenCalledWith('new-mock-locale-id');
      expect(globalizeService.loadMessages).toHaveBeenCalledTimes(2);

      sub.unsubscribe();
    });

    it('should resolve token from globalize', async () => {
      const { createI18nProcessor, globalizeService, localeService } = setup();
      const ctx = { ctx: true } as any;
      localeService.get.mockReturnValue(of('mock-locale-id'));
      globalizeService.formatMessage.mockResolvedValue('mock-resolved-text');

      const res$ = createI18nProcessor().interpolate('token', of(ctx));

      await expect(firstValueFrom(res$)).resolves.toBe('mock-resolved-text');
      expect(globalizeService.formatMessage).toHaveBeenCalledWith(
        'mock-locale-id',
        'token',
        ctx
      );
    });

    it('should resolve token from globalize when context changes', async () => {
      const { createI18nProcessor, globalizeService, localeService } = setup();
      const ctx$ = new BehaviorSubject({ ctx: 'mock-ctx' });
      localeService.get.mockReturnValue(of('mock-locale-id'));
      globalizeService.formatMessage.mockResolvedValue('mock-resolved-text');

      const res$ = createI18nProcessor()
        .interpolate('token', ctx$)
        // We need to share stream so subscriptions won't trigger extra calls
        .pipe(shareReplay(1));
      const sub = res$.subscribe(); // Init streams

      await expect(firstValueFrom(res$)).resolves.toBe('mock-resolved-text');
      expect(globalizeService.formatMessage).toHaveBeenCalledTimes(1);
      expect(globalizeService.formatMessage).toHaveBeenCalledWith(
        'mock-locale-id',
        'token',
        { ctx: 'mock-ctx' }
      );

      ctx$.next({ ctx: 'mock-new-ctx' });

      await firstValueFrom(res$);

      expect(globalizeService.formatMessage).toHaveBeenCalledTimes(2);
      expect(globalizeService.formatMessage).toHaveBeenCalledWith(
        'mock-locale-id',
        'token',
        { ctx: 'mock-new-ctx' }
      );

      sub.unsubscribe();
    });

    it('should return string with html if context has filters with html', async () => {
      const {
        createI18nProcessor,
        globalizeService,
        localeService,
        i18nInjectable,
      } = setup();
      const ctx = { ctx: true } as any;
      localeService.get.mockReturnValue(of('mock-locale-id'));
      globalizeService.formatMessage.mockResolvedValue('mock-resolved-text');
      i18nInjectable.hasHtml.mockReturnValue(true);
      const expectedResult = new String('mock-resolved-text') as I18nString;
      expectedResult.hasHtml = true;

      const res$ = createI18nProcessor().interpolate('token', of(ctx));
      const res = await firstValueFrom(res$);

      expect(res).toEqual(expectedResult);
      expect(res.hasHtml).toBe(expectedResult.hasHtml);
      expect(globalizeService.formatMessage).toHaveBeenCalledWith(
        'mock-locale-id',
        'token',
        ctx
      );
      expect(i18nInjectable.hasHtml).toHaveBeenCalledWith('token', ctx);
    });

    it('should try to resolve multiple tokens in order from globalize', async () => {
      const { createI18nProcessor, globalizeService, localeService } = setup();
      const ctx = { ctx: true } as any;
      localeService.get.mockReturnValue(of('mock-locale-id'));
      globalizeService.formatMessage.mockImplementation((_, token) =>
        Promise.resolve(token === 'token2' ? 'mock-resolved-text2' : undefined)
      );

      const res$ = createI18nProcessor().interpolate(
        ['token1', 'token2', 'token3'],
        of(ctx)
      );

      await expect(firstValueFrom(res$)).resolves.toBe('mock-resolved-text2');
      expect(globalizeService.formatMessage).toHaveBeenCalledWith(
        'mock-locale-id',
        'token1',
        ctx
      );
      expect(globalizeService.formatMessage).toHaveBeenCalledWith(
        'mock-locale-id',
        'token2',
        ctx
      );
      expect(globalizeService.formatMessage).not.toHaveBeenCalledWith(
        'mock-locale-id',
        'token3',
        ctx
      );
    });

    it('should try to resolve parts of token separated by dot from globalize', async () => {
      const { createI18nProcessor, globalizeService, localeService } = setup();
      const ctx = { ctx: true } as any;
      localeService.get.mockReturnValue(of('mock-locale-id'));
      globalizeService.formatMessage.mockImplementation((_, token) =>
        Promise.resolve(
          token === 'part2.part3' ? 'mock-resolved-part2' : undefined
        )
      );

      const res$ = createI18nProcessor().interpolate(
        'part1.part2.part3',
        of(ctx)
      );

      await expect(firstValueFrom(res$)).resolves.toBe('mock-resolved-part2');
      expect(globalizeService.formatMessage).toHaveBeenCalledWith(
        'mock-locale-id',
        'part1.part2.part3',
        ctx
      );
      expect(globalizeService.formatMessage).toHaveBeenCalledWith(
        'mock-locale-id',
        'part2.part3',
        ctx
      );
      expect(globalizeService.formatMessage).not.toHaveBeenCalledWith(
        'mock-locale-id',
        'part3',
        ctx
      );
    });

    describe('when globalize returns undefined', () => {
      it('should fallback to i18nInjectable.translate()', async () => {
        const {
          createI18nProcessor,
          globalizeService,
          localeService,
          i18nInjectable,
        } = setup();
        const ctx = { ctx: true } as any;
        localeService.get.mockReturnValue(of('mock-locale-id'));
        globalizeService.formatMessage.mockResolvedValue(undefined);
        i18nInjectable.translate.mockReturnValue('fallback-text');

        const res$ = createI18nProcessor().interpolate('token', of(ctx));

        await expect(firstValueFrom(res$)).resolves.toBe('fallback-text');
        expect(i18nInjectable.translate).toHaveBeenCalledWith('token', ctx);
      });

      it('should convert `I18nTranslationResult` with HTML to `I18nString`', async () => {
        const {
          createI18nProcessor,
          globalizeService,
          localeService,
          i18nInjectable,
        } = setup();
        const ctx = { ctx: true } as any;
        localeService.get.mockReturnValue(of('mock-locale-id'));
        globalizeService.formatMessage.mockResolvedValue(undefined);
        i18nInjectable.translate.mockReturnValue({
          text: 'fallback-text',
          hasHtml: true,
        });
        const expectedResult = new String('fallback-text') as I18nString;
        expectedResult.hasHtml = true;

        const res$ = createI18nProcessor().interpolate('token', of(ctx));
        const res = await firstValueFrom(res$);

        expect(res).toEqual(expectedResult);
        expect(res.hasHtml).toBe(expectedResult.hasHtml);
        expect(i18nInjectable.translate).toHaveBeenCalledWith('token', ctx);
      });

      it('should convert `I18nTranslationResult` without HTML to string', async () => {
        const {
          createI18nProcessor,
          globalizeService,
          localeService,
          i18nInjectable,
        } = setup();
        const ctx = { ctx: true } as any;
        localeService.get.mockReturnValue(of('mock-locale-id'));
        globalizeService.formatMessage.mockResolvedValue(undefined);
        i18nInjectable.translate.mockReturnValue({
          text: 'fallback-text',
          hasHtml: false,
        });

        const res$ = createI18nProcessor().interpolate('token', of(ctx));
        const res = await firstValueFrom(res$);

        expect(res).toBe('fallback-text');
        expect(i18nInjectable.translate).toHaveBeenCalledWith('token', ctx);
      });
    });
  });
});
