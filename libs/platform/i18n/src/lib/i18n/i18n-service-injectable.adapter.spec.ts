import { unsafeHTML } from 'lit/directives/unsafe-html.js';
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
    const asyncDir = vi.fn();
    const adapter = new I18nServiceInjectableAdapter(i18nService, asyncDir);

    return { i18nService, asyncDir, adapter };
  }

  describe('translate() method', () => {
    it('should call `I18nService.translate()` with params', () => {
      const { adapter, i18nService } = setup();

      adapter.translate('token', { ctx: true } as any);

      expect(i18nService.translate).toHaveBeenCalledWith('token', {
        ctx: true,
      });
    });

    it('should call `asyncValue()` with result from `I18nService.translate()`', () => {
      const { adapter, i18nService, asyncDir } = setup();
      i18nService.translate.mockReturnValue('mock-translate');
      asyncDir.mockImplementation((_, fn) => fn('mock-result'));

      const res = adapter.translate('token', { ctx: true } as any);

      expect(res).toBe('mock-result');
      expect(asyncDir).toHaveBeenCalledWith(
        'mock-translate',
        expect.any(Function)
      );
    });

    it('should return string from `I18nString`', () => {
      const { adapter, i18nService, asyncDir } = setup();
      const mockTranslate = new String('mock-translate') as I18nString;
      i18nService.translate.mockReturnValue(mockTranslate);
      asyncDir.mockImplementation((_, fn) => fn(mockTranslate));

      const res = adapter.translate('token', { ctx: true } as any);

      expect(res).toBe('mock-translate');
      expect(asyncDir).toHaveBeenCalledWith(
        mockTranslate,
        expect.any(Function)
      );
    });

    describe('when result string has HTML', () => {
      it('should call `unsafeHTML()` with result', () => {
        const { adapter, i18nService, asyncDir } = setup();
        const mockTranslate = new String('mock-translate') as I18nString;
        mockTranslate.hasHtml = true;
        i18nService.translate.mockReturnValue(mockTranslate);
        asyncDir.mockImplementation((_, fn) => fn(mockTranslate));

        const res = adapter.translate('token', { ctx: true } as any);

        expect(res).toEqual(
          expect.objectContaining({ values: [unsafeHTML('mock-translate')] })
        );
        expect(asyncDir).toHaveBeenCalledWith(
          mockTranslate,
          expect.any(Function)
        );
      });
    });
  });
});
