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

      adapter.translate('token', { ctx: true });

      expect(i18nService.translate).toHaveBeenCalledWith('token', {
        ctx: true,
      });
    });

    it('should call `asyncValue()` with result from `I18nService.translate()`', () => {
      const { adapter, i18nService, asyncDir } = setup();
      i18nService.translate.mockReturnValue('mock-translate');
      asyncDir.mockReturnValue('mock-result');

      const res = adapter.translate('token', { ctx: true });

      expect(res).toBe('mock-result');
      expect(asyncDir).toHaveBeenCalledWith('mock-translate');
    });
  });
});
