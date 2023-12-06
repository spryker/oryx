import { lastValueFrom } from 'rxjs';
import { LayoutPluginPropertiesParams } from '../../layout.plugin';
import { FlexLayoutPlugin } from './flex-layout.plugin';

describe('FlexLayoutPlugin', () => {
  let plugin: FlexLayoutPlugin;

  beforeEach(() => {
    plugin = new FlexLayoutPlugin();
  });

  describe('getStyles', () => {
    it('should return an Observable of LayoutStyles', async () => {
      const styles = await import('./flex-layout.styles').then(
        (module) => module.styles
      );
      const result = await lastValueFrom(plugin.getStyles({ options: {} }));

      expect(result).toEqual(styles);
    });
  });

  describe('getConfig', () => {
    it('should return proper schema in the object', async () => {
      const schema = await import('./flex-layout.schema').then(
        (module) => module.schema
      );
      const config = await lastValueFrom(plugin.getConfig?.());
      const result = await (config.schema as () => unknown)();

      expect(result).toEqual(schema);
    });
  });

  describe('getDefaultProperties', () => {
    it('should return wrap = true', async () => {
      const result = await lastValueFrom(plugin.getDefaultProperties());
      expect(result.wrap).toEqual(true);
    });
  });

  describe('getStyleProperties', () => {
    describe('when the wrap option is set to true', () => {
      let result: any;
      beforeEach(async () => {
        result = await lastValueFrom(
          plugin.getStyleProperties({
            options: { wrap: true },
          } as LayoutPluginPropertiesParams)
        );
      });

      it('should return flex-wrap', async () => {
        expect(result['flex-wrap']).toEqual('wrap');
      });
    });

    describe('when the wrap option is set to false', () => {
      let result: any;
      beforeEach(async () => {
        result = await lastValueFrom(
          plugin.getStyleProperties({
            options: { wrap: false },
          } as LayoutPluginPropertiesParams)
        );
      });

      it('should return flex-wrap', async () => {
        expect(result['flex-wrap']).toBeFalsy();
      });
    });
  });
});
