import { lastValueFrom } from 'rxjs';
import { OverlapLayoutPlugin } from './overlap-layout.plugin';

describe('OverlapLayoutPlugin', () => {
  let plugin: OverlapLayoutPlugin;

  beforeEach(() => {
    plugin = new OverlapLayoutPlugin();
  });

  describe('getStyles', () => {
    it('should return an Observable of LayoutStyles', async () => {
      const styles = await import('./overlap.styles').then(
        (module) => module.styles
      );
      const result = await lastValueFrom(plugin.getStyles());

      expect(result).toEqual(styles);
    });
  });

  describe('getConfig', () => {
    it('should return proper schema in the object', async () => {
      const schema = await import('./overlap-layout.schema').then(
        (module) => module.schema
      );
      const config = await lastValueFrom(plugin.getConfig?.());
      const result = await (config.schema as () => unknown)();

      expect(result).toEqual(schema);
    });
  });
});
