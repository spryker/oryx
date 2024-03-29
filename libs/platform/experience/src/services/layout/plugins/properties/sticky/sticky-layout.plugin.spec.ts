import { lastValueFrom } from 'rxjs';
import { StickyLayoutPlugin } from './sticky-layout.plugin';

describe('StickyLayoutPlugin', () => {
  let plugin: StickyLayoutPlugin;

  beforeEach(() => {
    plugin = new StickyLayoutPlugin();
  });

  describe('getStyles', () => {
    it('should return an Observable of LayoutStyles', async () => {
      const styles = await import('./sticky.styles').then(
        (module) => module.styles
      );
      const result = await lastValueFrom(plugin.getStyles());

      expect(result).toEqual(styles);
    });
  });

  describe('getConfig', () => {
    it('should return proper schema in the object', async () => {
      const schema = await import('./sticky-layout.schema').then(
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
        height: '100px',
        top: '10',
        layout: {
          overflow: 'overflow',
          zIndex: 1,
        },
      };
      const styleProperties = [
        [
          {
            'max-height': `calc(${data.height} - ${data.top})`,
            overflow: data.layout.overflow,
          },
        ],
        [{ 'z-index': data.layout.zIndex }, { omitUnit: true }],
      ];
      const result = await lastValueFrom(
        plugin.getStyleProperties({ styles: data, options: {} })
      );

      expect(result).toEqual(styleProperties);
    });
  });
});
