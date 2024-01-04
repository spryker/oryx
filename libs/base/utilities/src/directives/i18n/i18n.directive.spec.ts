import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import {
  I18nInjectable,
  I18nTranslationValue,
  i18nInjectable,
} from '../../injectables/i18n/i18n.injectable';
import { i18n, i18nMapInjectable } from './i18n.directive';

describe('i18n directive', () => {
  beforeEach(() => {
    i18nMapInjectable.inject(new Map());
  });

  it('should call `I18nInjectable.translate()`', () => {
    const mockI18n: I18nInjectable = {
      translate: vi.fn().mockReturnValue('mock-result'),
    };
    i18nInjectable.inject(mockI18n);

    i18n('token', { ctx: true });

    expect(mockI18n.translate).toHaveBeenCalledWith('token', { ctx: true });
  });

  describe('when `I18nInjectable.translate()` returns undefined', () => {
    it('should return empty string', () => {
      const mockI18n: I18nInjectable = {
        translate: vi.fn().mockReturnValue(undefined),
      };
      i18nInjectable.inject(mockI18n);

      expect(i18n('token')).toBe('');
    });
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

  describe('when I18nContent is provided', () => {
    const content = { token: 'mock-token', values: {} };
    let mockI18n: I18nInjectable;

    beforeEach(() => {
      mockI18n = {
        translate: vi.fn().mockReturnValue('mock-result'),
      };
      i18nInjectable.inject(mockI18n);
      i18n(content);
    });

    it('should pass token and values to the translate method', () => {
      expect(mockI18n.translate).toHaveBeenCalledWith(
        content.token,
        content.values
      );
    });

    describe('and raw string is provided', () => {
      const content = { raw: 'mock-raw' };
      let result: I18nTranslationValue;

      beforeEach(() => {
        mockI18n = {
          translate: vi.fn().mockReturnValue('mock-result'),
        };
        i18nInjectable.inject(mockI18n);
        result = i18n(content);
      });

      it('should pass pass raw string without processing', () => {
        expect(result).toBe(content.raw);
      });
    });
  });
});
