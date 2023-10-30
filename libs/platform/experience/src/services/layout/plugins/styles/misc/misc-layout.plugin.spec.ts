import { lastValueFrom } from 'rxjs';
import { MiscLayoutPlugin } from './misc-layout.plugin';

describe('MiscLayoutPlugin', () => {
  let plugin: MiscLayoutPlugin;

  beforeEach(() => {
    plugin = new MiscLayoutPlugin();
  });

  describe('getConfig', () => {
    it('should return proper schema in the object', async () => {
      const schema = await import('./misc-layout.schema').then(
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
        radius: 'radius',
        border: 'border',
        background: 'background',
        fill: 'fill',
        ratio: 'ratio',
        overflow: 'overflow',
        gap: 20,
        zIndex: 1,
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
            border: data.border,
            'border-radius': data.radius,
            background: data.background,
            '--oryx-fill': data.fill,
            'aspect-ratio': data.ratio,
            overflow: data.overflow,
          },
        ],
        [
          { '--column-gap': `${data.gap}`, '--row-gap': `${data.gap}` },
          { emptyValue: true },
        ],
        [
          { 'z-index': data.zIndex, '--oryx-column-count': data.columnCount },
          { omitUnit: true },
        ],
        [{ 'grid-column': `${data.gridColumn} / span ${data.colSpan}` }],
        [{ 'grid-row': `${data.gridRow} / span ${data.rowSpan}` }],
      ];
      const result = await lastValueFrom(plugin.getStyleProperties(data));

      expect(result).toEqual(styleProperties);
    });
  });
});
