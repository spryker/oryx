import { lastValueFrom } from 'rxjs';
import { BleedLayoutPlugin } from './bleed-layout.plugin';

describe('BleedLayoutPlugin', () => {
  let plugin: BleedLayoutPlugin;

  beforeEach(() => {
    plugin = new BleedLayoutPlugin();
  });

  describe('getStyles', () => {
    it('should return an Observable of LayoutStyles', async () => {
      const styles = await import('./bleed.styles').then(
        (module) => module.styles
      );
      const result = await lastValueFrom(plugin.getStyles());

      expect(result).toEqual(styles);
    });
  });

  describe('getConfig', () => {
    it('should return proper schema in the object', async () => {
      const schema = await import('./bleed-layout.schema').then(
        (module) => module.schema
      );
      const result = await (plugin.getConfig?.().schema as () => unknown)();

      expect(result).toEqual(schema);
    });
  });

  describe('getStyleProperties', () => {
    it('should return a LayoutPluginStyleProperties object', () => {
      const styleProperties = { 'padding-inline': '0' };

      expect(plugin.getStyleProperties()).toEqual(styleProperties);
    });
  });
});
