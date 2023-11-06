import { I18nContextFilter } from './i18n-context-filter';
import { DefaultI18nInjectable } from './i18n-default.injectable';

vi.mock('./filters', () => ({
  defaultI18nContextFilters: [
    new MockI18nFilter('default-filter', 'default-value'),
  ],
}));

class MockI18nFilter {
  getName = vi.fn();
  process = vi.fn();
  producesHtml = vi.fn().mockReturnValue(false);

  constructor(name: string, processValue?: unknown) {
    this.getName.mockReturnValue(name);

    if (processValue) {
      this.process.mockReturnValue(processValue);
    }
  }
}

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
          tokenPropStart: '\\[' as any,
          tokenPropEnd: '\\]' as any,
        });

        expect(
          i18nInjectable.translate('some-domain.readable-part-[var]', {
            var: 'ctx-val',
          })
        ).toBe('Readable part ctx-val');
      });

      it('should convert token with empty context to readable text', () => {
        const i18nInjectable = new DefaultI18nInjectable({
          tokenPropStart: '\\[' as any,
          tokenPropEnd: '\\]' as any,
        });

        expect(
          i18nInjectable.translate('some-domain.readable-part-[var]')
        ).toBe('Readable part');
      });
    });

    describe('with filters', () => {
      it('should convert token and apply filters to context', () => {
        const mockFilter1 = new MockI18nFilter('filter1');
        const mockFilter2 = new MockI18nFilter('filter2');
        const mockFilter3 = new MockI18nFilter('filter3');
        mockFilter1.process.mockReturnValue('filtered-result');

        const context = {
          val: {
            value: 'value',
            filter1: { config: true },
          },
        };

        const i18nInjectable = new DefaultI18nInjectable({
          filters: [mockFilter1, mockFilter2, mockFilter3],
        });

        expect(
          i18nInjectable.translate('some-domain.<val>-readable-part', context)
        ).toBe('filtered-result readable part');
        expect(mockFilter1.process).toHaveBeenCalledWith(
          'value',
          { config: true },
          context
        );
        expect(mockFilter2.process).not.toHaveBeenCalled();
        expect(mockFilter3.process).not.toHaveBeenCalled();
      });

      describe('default filters', () => {
        let originalDefaultFilters: I18nContextFilter[];

        beforeEach(() => {
          DefaultI18nInjectable.DefaultFilters = [
            new MockI18nFilter('default-filter', 'default-value'),
          ];
        });

        afterEach(() => {
          DefaultI18nInjectable.DefaultFilters = originalDefaultFilters;
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          originalDefaultFilters = undefined!;
        });

        it('should have default filters', () => {
          const context = {
            val: {
              value: 'value',
              'default-filter': { config: true },
            },
          };

          const i18nInjectable = new DefaultI18nInjectable();

          expect(
            i18nInjectable.translate('some-domain.<val>-readable-part', context)
          ).toBe('default-value readable part');
        });
      });

      describe('when filter produces html', () => {
        it('should apply filters and return html with a flag', () => {
          const mockFilter1 = new MockI18nFilter('filter1');
          mockFilter1.process.mockReturnValue('filtered-<b>result</b>');
          mockFilter1.producesHtml.mockReturnValue(true);

          const context = {
            val: {
              value: 'value',
              filter1: { config: true },
            },
          };

          const i18nInjectable = new DefaultI18nInjectable({
            filters: [mockFilter1],
          });

          expect(
            i18nInjectable.translate('some-domain.<val>-readable-part', context)
          ).toEqual({
            text: 'filtered-<b>result</b> readable part',
            hasHtml: true,
          });
          expect(mockFilter1.process).toHaveBeenCalledWith(
            'value',
            { config: true },
            context
          );
        });
      });
    });
  });
});
