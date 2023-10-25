import { lastValueFrom } from 'rxjs';
import { SplitAsideLayoutPlugin } from './split-aside-layout.plugin';

describe('SplitAsideLayoutPlugin', () => {
  let plugin: SplitAsideLayoutPlugin;

  beforeEach(() => {
    plugin = new SplitAsideLayoutPlugin();
  });

  describe('getStyles', () => {
    it('should return an Observable of LayoutStyles', async () => {
      const styles = await import('./split-aside-layout.styles').then(
        (module) => module.styles
      );
      const result = await lastValueFrom(plugin.getStyles());

      expect(result).toEqual(styles);
    });
  });

  describe('getConfig', () => {
    it('should return proper schema in the object', async () => {
      const schema = await import('./split-aside-layout.schema').then(
        (module) => module.schema
      );
      const result = await (plugin.getConfig?.().schema as () => unknown)();

      expect(result).toEqual(schema);
    });
  });
});
