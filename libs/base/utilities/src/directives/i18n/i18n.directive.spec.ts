import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import {
  I18nInjectable,
  i18nInjectable,
} from '../../injectables/i18n/i18n.injectable';
import { i18n } from './i18n.directive';

describe('i18n directive', () => {
  it('should call `I18nInjectable.translate()`', () => {
    const mockI18n: I18nInjectable = {
      translate: vi.fn().mockReturnValue('mock-result'),
    };
    i18nInjectable.inject(mockI18n);

    i18n('token', { ctx: true });

    expect(mockI18n.translate).toHaveBeenCalledWith('token', { ctx: true });
  });

  describe('when `I18nInjectable.translate()` returns string', () => {
    it('should return string', () => {
      const mockI18n: I18nInjectable = {
        translate: vi.fn().mockReturnValue('mock-result'),
      };
      i18nInjectable.inject(mockI18n);

      expect(i18n('token')).toBe('mock-result');
    });
  });

  describe('when `I18nInjectable.translate()` returns `I18nTranslationResult`', () => {
    describe('when `text` is a string', () => {
      it('should return string', () => {
        const mockI18n: I18nInjectable = {
          translate: vi.fn().mockReturnValue({ text: 'mock-result' }),
        };
        i18nInjectable.inject(mockI18n);

        expect(i18n('token')).toBe('mock-result');
      });

      it('should return unsafe HTML when hasHtml=true', () => {
        const mockI18n: I18nInjectable = {
          translate: vi
            .fn()
            .mockReturnValue({ text: 'mock-result', hasHtml: true }),
        };
        i18nInjectable.inject(mockI18n);

        expect(i18n('token')).toEqual(
          expect.objectContaining({
            values: [unsafeHTML('mock-result')],
          })
        );
      });
    });

    describe('when `text` is `DirectiveResult`', () => {
      it('should return `DirectiveResult`', () => {
        const mockDirectiveResult = {};
        const mockI18n: I18nInjectable = {
          translate: vi.fn().mockReturnValue({
            text: mockDirectiveResult,
          }),
        };
        i18nInjectable.inject(mockI18n);

        expect(i18n('token')).toBe(mockDirectiveResult);
      });
    });
  });

  describe('when `I18nInjectable.translate()` returns `DirectiveResult`', () => {
    it('should return `DirectiveResult`', () => {
      const mockDirectiveResult = {};
      const mockI18n: I18nInjectable = {
        translate: vi.fn().mockReturnValue(mockDirectiveResult),
      };
      i18nInjectable.inject(mockI18n);

      expect(i18n('token')).toBe(mockDirectiveResult);
    });
  });
});
