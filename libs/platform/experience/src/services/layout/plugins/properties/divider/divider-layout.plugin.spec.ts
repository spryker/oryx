import { lastValueFrom } from 'rxjs';
import { DividerLayoutPlugin } from './divider-layout.plugin';

describe('DividerLayoutPlugin', () => {
  let plugin: DividerLayoutPlugin;

  beforeEach(() => {
    plugin = new DividerLayoutPlugin();
  });

  describe('getStyles', () => {
    it('should return an Observable of LayoutStyles', async () => {
      const styles = await import('./divider.styles').then(
        (module) => module.styles
      );
      const result = await lastValueFrom(plugin.getStyles());

      expect(result).toEqual(styles);
    });
  });

  describe('getConfig', () => {
    it('should return proper schema in the object', async () => {
      const schema = await import('./divider-layout.schema').then(
        (module) => module.schema
      );
      const config = await lastValueFrom(plugin.getConfig?.());
      const result = await (config.schema as () => unknown)();

      expect(result).toEqual(schema);
    });
  });
});
