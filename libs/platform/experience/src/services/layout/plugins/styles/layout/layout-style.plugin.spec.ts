import { lastValueFrom } from 'rxjs';
import { LayoutStylePlugin } from './layout-style.plugin';

describe('LayoutStylePlugin', () => {
  let plugin: LayoutStylePlugin;

  beforeEach(() => {
    plugin = new LayoutStylePlugin();
  });

  describe('getConfig', () => {
    it('should return proper schema in the object', async () => {
      const schema = await import('./layout-style.schema').then(
        (module) => module.schema
      );
      const config = await lastValueFrom(plugin.getConfig?.());
      const result = await (config.schema as () => unknown)();

      expect(result).toEqual(schema);
    });
  });

  describe('getStyleProperties', () => {
    it('should return a LayoutStyleProperties object', async () => {
      const data = {
        align: 'align',
        justify: 'justify',
        gap: 20,
        gridColumn: 4,
        colSpan: 3,
        gridRow: 2,
        rowSpan: 5,
        columnCount: 6,
      };
      const styleProperties = [
        [
          {
            '--align': data.align,
            '--justify': data.justify,
          },
        ],
        [
          { '--column-gap': `${data.gap}`, '--row-gap': `${data.gap}` },
          { emptyValue: true },
        ],
        [{ '--oryx-column-count': data.columnCount }, { omitUnit: true }],
        [{ 'grid-column': `${data.gridColumn} / span ${data.colSpan}` }],
        [{ 'grid-row': `${data.gridRow} / span ${data.rowSpan}` }],
      ];
      const result = await lastValueFrom(
        plugin.getStyleProperties({ styles: data })
      );

      expect(result).toEqual(styleProperties);
    });
  });
});
