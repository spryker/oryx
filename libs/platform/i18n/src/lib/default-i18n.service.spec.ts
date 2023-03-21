import { rxjsTestScheduler } from '@spryker-oryx/core/testing';
import { EMPTY, Observable, of } from 'rxjs';
import { DefaultI18nService } from './default-i18n.service';
import { I18nProcessor } from './i18n.processor';

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
      const ctx$ = of({ ctx: true });

      i18nService.translate('token', ctx$);

      expect(i18nProcessor.interpolate).toHaveBeenCalledWith('token', ctx$);
    });

    it('should call `I18nProcessor.interpolate()` with context converted to observable', () => {
      rxjsTestScheduler().run(({ expectObservable }) => {
        const { i18nService, i18nProcessor } = setup();
        const ctx = { ctx: true };

        i18nService.translate('token', ctx);

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

        const res$ = i18nService.translate('token', { ctx: true });

        expectObservable(res$, sub1).toBe(exp1);
        expectObservable(res$, sub2).toBe(exp2);
      });
    });
  });
});
