import { lastValueFrom } from 'rxjs';
import { ListLayoutPlugin } from './list.plugin';

describe('ListLayoutPlugin', () => {
  let plugin: ListLayoutPlugin;

  beforeEach(() => {
    plugin = new ListLayoutPlugin();
  });

  describe('getStyles', () => {
    it('should return an Observable of LayoutStyles', async () => {
      const styles = await import('./list.styles').then(
        (module) => module.styles
      );
      const result = await lastValueFrom(plugin.getStyles());

      expect(result).toEqual(styles);
    });
  });

  describe('getConfig', () => {
    it('should return proper schema in the object', async () => {
      const schema = await import('./list.schema').then(
        (module) => module.schema
      );
      const config = await lastValueFrom(plugin.getConfig?.());
      const result = await (config.schema as () => unknown)();

      expect(result).toEqual(schema);
    });
  });
});
