import { of } from 'rxjs';
import { I18nString } from '../models';
import { I18nServiceInjectableAdapter } from './i18n-service-injectable.adapter';
import { I18nService } from './i18n.service';

describe('I18nServiceInjectableAdapter', () => {
  class MockI18nService implements I18nService {
    translate = vi.fn();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  function setup() {
    const i18nService = new MockI18nService();
    const adapter = new I18nServiceInjectableAdapter(i18nService);

    return { i18nService, adapter };
  }

  describe('translate() method', () => {
    it('should call `I18nService.translate()` with params', () => {
      const { adapter, i18nService } = setup();
      i18nService.translate.mockReturnValue(of('mock-translate'));

      adapter.translate('token', { ctx: true } as any);

      expect(i18nService.translate).toHaveBeenCalledWith('token', {
        ctx: true,
      });
    });

    it('should return string from `I18nString`', () => {
      const { adapter, i18nService } = setup();
      const mockTranslate = new String('mock-translate') as I18nString;
      i18nService.translate.mockReturnValue(of(mockTranslate));
      const callback = vi.fn();

      const res$ = adapter.translate('token', { ctx: true } as any);
      res$.subscribe(callback).unsubscribe();

      expect(callback).toHaveBeenCalledWith('mock-translate');
    });

    describe('when result string has HTML', () => {
      it('should return `I18nTranslationResult`', () => {
        const { adapter, i18nService } = setup();
        const mockTranslate = new String('mock-translate') as I18nString;
        mockTranslate.hasHtml = true;
        i18nService.translate.mockReturnValue(of(mockTranslate));
        const callback = vi.fn();

        const res$ = adapter.translate('token', { ctx: true } as any);
        res$.subscribe(callback).unsubscribe();

        expect(callback).toHaveBeenCalledWith({
          text: 'mock-translate',
          hasHtml: true,
        });
      });
    });
  });
});
