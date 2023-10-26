import { lastValueFrom } from 'rxjs';
import { TransformLayoutPlugin } from './transform-layout.plugin';

describe('TransformLayoutPlugin', () => {
  let plugin: TransformLayoutPlugin;

  beforeEach(() => {
    plugin = new TransformLayoutPlugin();
  });

  describe('getConfig', () => {
    it('should return proper schema in the object', async () => {
      const schema = await import('./transform-layout.schema').then(
        (module) => module.schema
      );
      const config = await lastValueFrom(plugin.getConfig?.());
      const result = await (config.schema as () => unknown)();

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
