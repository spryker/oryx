import { lastValueFrom } from 'rxjs';
import { SplitMainLayoutPlugin } from './split-main-layout.plugin';

describe('SplitMainLayoutPlugin', () => {
  let plugin: SplitMainLayoutPlugin;

  beforeEach(() => {
    plugin = new SplitMainLayoutPlugin();
  });

  describe('getStyles', () => {
    it('should return an Observable of LayoutStyles', async () => {
      const styles = await import('./split-main-layout.styles').then(
        (module) => module.styles
      );
      const result = await lastValueFrom(plugin.getStyles());

      expect(result).toEqual(styles);
    });
  });

  describe('getConfig', () => {
    it('should return proper schema in the object', async () => {
      const schema = await import('./split-main-layout.schema').then(
        (module) => module.schema
      );
      const result = await (plugin.getConfig?.().schema as () => unknown)();

      expect(result).toEqual(schema);
    });
  });
});
