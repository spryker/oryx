import { lastValueFrom } from 'rxjs';
import { GridLayoutPlugin } from './grid-layout.plugin';

describe('GridLayoutPlugin', () => {
  let plugin: GridLayoutPlugin;

  beforeEach(() => {
    plugin = new GridLayoutPlugin();
  });

  describe('getStyles', () => {
    it('should return an Observable of LayoutStyles', async () => {
      const styles = await import('./grid-layout.styles').then(
        (module) => module.styles
      );
      const result = await lastValueFrom(plugin.getStyles({ options: {} }));

      expect(result).toEqual(styles);
    });
  });

  describe('getConfig', () => {
    it('should return proper schema in the object', async () => {
      const schema = await import('./grid-layout.schema').then(
        (module) => module.schema
      );
      const config = await lastValueFrom(plugin.getConfig?.());
      const result = await (config.schema as () => unknown)();

      expect(result).toEqual(schema);
    });
  });
});
