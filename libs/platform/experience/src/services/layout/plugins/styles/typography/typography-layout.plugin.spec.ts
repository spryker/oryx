import { TypographyLayoutPlugin } from './typography-layout.plugin';

describe('TypographyLayoutPlugin', () => {
  let plugin: TypographyLayoutPlugin;

  beforeEach(() => {
    plugin = new TypographyLayoutPlugin();
  });

  describe('getConfig', () => {
    it('should return proper schema in the object', async () => {
      const schema = await import('./typography-layout.schema').then(
        (module) => module.schema
      );
      const result = await (plugin.getConfig?.().schema as () => unknown)();

      expect(result).toEqual(schema);
    });
  });

  describe('getStyleProperties', () => {
    it('should return a LayoutStyleProperties object', () => {
      const data = { height: '100px', top: '10' };
      const styleProperties = {
        'max-height': `calc(${data.height} - ${data.top})`,
      };

      expect(plugin.getStyleProperties(data)).toEqual(styleProperties);
    });
  });
});
