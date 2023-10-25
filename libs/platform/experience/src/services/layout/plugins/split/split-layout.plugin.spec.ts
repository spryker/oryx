import { lastValueFrom } from 'rxjs';
import { SplitLayoutPlugin } from './split-layout.plugin';

describe('SplitLayoutPlugin', () => {
  let plugin: SplitLayoutPlugin;

  beforeEach(() => {
    plugin = new SplitLayoutPlugin();
  });

  describe('getStyles', () => {
    it('should return an Observable of LayoutStyles', async () => {
      const styles = await import('./split-layout.styles').then(
        (module) => module.styles
      );
      const result = await lastValueFrom(plugin.getStyles());

      expect(result).toEqual(styles);
    });
  });

  describe('getConfig', () => {
    it('should return proper schema in the object', async () => {
      const schema = await import('./split-layout.schema').then(
        (module) => module.schema
      );
      const result = await (plugin.getConfig?.().schema as () => unknown)();

      expect(result).toEqual(schema);
    });
  });
});
