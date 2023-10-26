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
    it('should return a LayoutStyleProperties object', () => {
      const data = { height: '100px', top: '10' };
      const styleProperties = {
        'max-height': `calc(${data.height} - ${data.top})`,
      };

      expect(plugin.getStyleProperties(data)).toEqual(styleProperties);
    });
  });
});
