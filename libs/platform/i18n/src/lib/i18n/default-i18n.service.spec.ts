import { rxjsTestScheduler } from '@spryker-oryx/core/testing';
import { BehaviorSubject, EMPTY, Observable, of } from 'rxjs';
import { DefaultI18nService } from './default-i18n.service';
import { I18nProcessor } from './i18n.processor';

vi.mock('lit', () => ({ isServer: false }));

describe('DefaultI18nService', () => {
  class MockI18nProcessor implements I18nProcessor {
    interpolate = vi.fn().mockReturnValue(EMPTY);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  function setup() {
    const i18nProcessor = new MockI18nProcessor();
    const i18nService = new DefaultI18nService(i18nProcessor);

    return { i18nService, i18nProcessor };
  }

  describe('translate() method', () => {
    it('should call `I18nProcessor.interpolate()` with context as observable', () => {
      const { i18nService, i18nProcessor } = setup();
      const ctx$ = of({ ctx: true } as any);
      const ctxSpy = vi.fn();

      i18nService.translate('token', ctx$).subscribe().unsubscribe();

      expect(i18nProcessor.interpolate).toHaveBeenCalledWith(
        'token',
        expect.any(Observable)
      );

      const actualCtx$ = i18nProcessor.interpolate.mock
        .calls[0][1] as Observable<unknown>;
      actualCtx$.subscribe(ctxSpy);

      expect(ctxSpy).toHaveBeenCalledWith({ ctx: true });
    });

    it('should call `I18nProcessor.interpolate()` with context converted to observable', () => {
      rxjsTestScheduler().run(({ expectObservable }) => {
        const { i18nService, i18nProcessor } = setup();
        const ctx = { ctx: true } as any;

        i18nService.translate('token', ctx).subscribe().unsubscribe();

        expect(i18nProcessor.interpolate).toHaveBeenCalledWith(
          'token',
          expect.any(Observable)
        );

        const ctx$ = i18nProcessor.interpolate.mock
          .calls[0][1] as Observable<unknown>;

        expectObservable(ctx$).toBe('(c|)', { c: ctx });
      });
    });

    it('should return replayed result from `I18nProcessor.interpolate()`', () => {
      rxjsTestScheduler().run(({ expectObservable, hot }) => {
        const obs1 = '-a---b---c--| ';

        // At first subscription observable is not replaying events
        const sub1 = '---^---------!';
        const exp1 = '-----b---c--| ';

        // After first subscription observable is replaying events
        const sub2 = '-------^-----!';
        const exp2 = '-------b-c--| ';

        const { i18nService, i18nProcessor } = setup();
        i18nProcessor.interpolate.mockReturnValue(hot(obs1));

        const res$ = i18nService.translate('token', { ctx: true } as any);

        expectObservable(res$, sub1).toBe(exp1);
        expectObservable(res$, sub2).toBe(exp2);
      });
    });

    it('should cache result from `I18nProcessor.interpolate()`', () => {
      const { i18nService, i18nProcessor } = setup();
      const obs1$ = new BehaviorSubject('a');
      i18nProcessor.interpolate.mockReturnValue(obs1$);

      const res1$ = i18nService.translate('token');

      expect(i18nProcessor.interpolate).not.toHaveBeenCalled();

      res1$.subscribe().unsubscribe();

      expect(i18nProcessor.interpolate).toHaveBeenCalledTimes(1);

      const res2$ = i18nService.translate('token');

      res2$.subscribe().unsubscribe();

      expect(i18nProcessor.interpolate).toHaveBeenCalledTimes(1);
    });

    it('should clear cache when 0 subscriptions and after 5m timeout', () => {
      vi.useFakeTimers();

      const { i18nService, i18nProcessor } = setup();
      const obs1$ = new BehaviorSubject('a');
      i18nProcessor.interpolate.mockReturnValue(obs1$);

      i18nService.translate('token').subscribe().unsubscribe();
      expect(i18nProcessor.interpolate).toHaveBeenCalledTimes(1);

      i18nService.translate('token').subscribe().unsubscribe();
      expect(i18nProcessor.interpolate).toHaveBeenCalledTimes(1);

      // Cache is still valid after 4m 59s
      vi.advanceTimersByTime(1000 * 60 * 4 + 1000 * 59);
      i18nService.translate('token').subscribe().unsubscribe();
      expect(i18nProcessor.interpolate).toHaveBeenCalledTimes(1);

      // Cache is cleared after 5m
      vi.advanceTimersByTime(1000);
      i18nService.translate('token').subscribe().unsubscribe();
      expect(i18nProcessor.interpolate).toHaveBeenCalledTimes(2);
    });

    describe('when SSR', () => {
      let cacheCleanupTimeout: number | false | undefined;

      beforeAll(() => {
        cacheCleanupTimeout = DefaultI18nService.CacheCleanupTimeout;
        DefaultI18nService.CacheCleanupTimeout = false;
      });

      afterAll(() => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        DefaultI18nService.CacheCleanupTimeout = cacheCleanupTimeout!;
      });

      it('should clean cache immediately after unsubscription', () => {
        const { i18nService, i18nProcessor } = setup();
        const obs1$ = new BehaviorSubject('a');
        i18nProcessor.interpolate.mockReturnValue(obs1$);

        i18nService.translate('token').subscribe().unsubscribe();
        expect(i18nProcessor.interpolate).toHaveBeenCalledTimes(1);

        i18nService.translate('token').subscribe().unsubscribe();
        expect(i18nProcessor.interpolate).toHaveBeenCalledTimes(2);
      });
    });
  });
});
