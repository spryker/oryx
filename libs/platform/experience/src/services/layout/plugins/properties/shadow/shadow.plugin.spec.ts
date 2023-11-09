import { lastValueFrom } from 'rxjs';
import { ShadowLayoutPlugin } from './shadow.plugin';

describe('ShadowLayoutPlugin', () => {
  let plugin: ShadowLayoutPlugin;

  beforeEach(() => {
    plugin = new ShadowLayoutPlugin();
  });

  describe('getStyles', () => {
    it('should return an Observable of LayoutStyles', async () => {
      const styles = await import('./shadow.styles').then(
        (module) => module.styles
      );
      const result = await lastValueFrom(plugin.getStyles());

      expect(result).toEqual(styles);
    });
  });

  describe('getConfig', () => {
    it('should return proper schema in the object', async () => {
      const schema = await import('./shadow.schema').then(
        (module) => module.schema
      );
      const config = await lastValueFrom(plugin.getConfig?.());
      const result = await (config.schema as () => unknown)();

      expect(result).toEqual(schema);
    });
  });
});
