import {
  I18nInjectable,
  i18nInjectable,
} from '../../injectables/i18n/i18n.injectable';
import { i18n } from './i18n.directive';

describe('i18n directive', () => {
  it('should call `I18nInjectable.translate()` and return result', () => {
    const mockI18n: I18nInjectable = {
      translate: vi.fn().mockReturnValue('mock-result'),
    };

    i18nInjectable.inject(mockI18n);

    expect(i18n('token', { ctx: true })).toBe('mock-result');
    expect(mockI18n.translate).toHaveBeenCalledWith('token', { ctx: true });
  });
});
