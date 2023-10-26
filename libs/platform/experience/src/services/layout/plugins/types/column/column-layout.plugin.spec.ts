import { lastValueFrom } from 'rxjs';
import { ColumnLayoutPlugin } from './column-layout.plugin';

describe('ColumnLayoutPlugin', () => {
  let plugin: ColumnLayoutPlugin;

  beforeEach(() => {
    plugin = new ColumnLayoutPlugin();
  });

  describe('getStyles', () => {
    it('should return an Observable of LayoutStyles', async () => {
      const styles = await import('./column-layout.styles').then(
        (module) => module.styles
      );
      const result = await lastValueFrom(plugin.getStyles());

      expect(result).toEqual(styles);
    });
  });

  describe('getConfig', () => {
    it('should return proper schema in the object', async () => {
      const schema = await import('./column-layout.schema').then(
        (module) => module.schema
      );
      const result = await (plugin.getConfig?.().schema as () => unknown)();

      expect(result).toEqual(schema);
    });
  });
});
