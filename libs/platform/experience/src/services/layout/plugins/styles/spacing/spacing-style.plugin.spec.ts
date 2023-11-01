import { lastValueFrom } from 'rxjs';
import { SpacingStylePlugin } from './spacing-style.plugin';

describe('SpacingStylePlugin', () => {
  let plugin: SpacingStylePlugin;

  beforeEach(() => {
    plugin = new SpacingStylePlugin();
  });

  describe('getConfig', () => {
    it('should return proper schema in the object', async () => {
      const schema = await import('./spacing-style.schema').then(
        (module) => module.schema
      );
      const config = await lastValueFrom(plugin.getConfig?.());
      const result = await (config.schema as () => unknown)();

      expect(result).toEqual(schema);
    });
  });

  describe('getStyleProperties', () => {
    it('should return a LayoutStyleProperties object', async () => {
      const data = {
        margin: '10px',
        top: '10',
        height: '15px',
        width: '120px',
        padding: '10px 5px 2px 3px',
      };
      const styleProperties = {
        margin: data.margin,
        'inset-block-start': data.top,
        height: data.height,
        width: data.width,
        'scroll-padding': '3px',
        'padding-block': '10px 2px',
        'padding-inline': '3px 5px',
        '--inline-padding': '3px 5px',
      };
      const result = await lastValueFrom(
        plugin.getStyleProperties({ styles: data })
      );

      expect(result).toEqual(styleProperties);
    });
  });
});
