import { DefaultI18nInjectable } from './i18n-default.injectable';

describe('DefaultI18nInjectable', () => {
  describe('translate() method', () => {
    it('should convert simple token to readable text', () => {
      const i18nInjectable = new DefaultI18nInjectable();

      expect(i18nInjectable.translate('simple-token-text')).toBe(
        'Simple token text'
      );
    });

    it('should convert first token to readable text', () => {
      const i18nInjectable = new DefaultI18nInjectable();

      expect(i18nInjectable.translate(['first-token', 'second-token'])).toBe(
        'First token'
      );
    });

    it('should convert token with domain to readable text', () => {
      const i18nInjectable = new DefaultI18nInjectable();

      expect(i18nInjectable.translate('some-domain.readable-part')).toBe(
        'Readable part'
      );
    });

    it('should convert token with context to readable text', () => {
      const i18nInjectable = new DefaultI18nInjectable();

      expect(
        i18nInjectable.translate('some-domain.readable-part-<var>', {
          var: 'ctx-val',
        })
      ).toBe('Readable part ctx-val');
    });

    it('should convert token with empty context to readable text', () => {
      const i18nInjectable = new DefaultI18nInjectable();

      expect(i18nInjectable.translate('some-domain.readable-part-<var>')).toBe(
        'Readable part'
      );
    });

    describe('with custom config', () => {
      it('should convert token with context to readable text', () => {
        const i18nInjectable = new DefaultI18nInjectable({
          tokenPropStart: '\\[',
          tokenPropEnd: '\\]',
        });

        expect(
          i18nInjectable.translate('some-domain.readable-part-[var]', {
            var: 'ctx-val',
          })
        ).toBe('Readable part ctx-val');
      });

      it('should convert token with empty context to readable text', () => {
        const i18nInjectable = new DefaultI18nInjectable({
          tokenPropStart: '\\[',
          tokenPropEnd: '\\]',
        });

        expect(
          i18nInjectable.translate('some-domain.readable-part-[var]')
        ).toBe('Readable part');
      });
    });
  });
});
