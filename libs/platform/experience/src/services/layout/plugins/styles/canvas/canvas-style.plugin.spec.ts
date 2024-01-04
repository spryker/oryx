import { lastValueFrom } from 'rxjs';
import { ShadowElevation } from './canvas-style.model';
import { CanvasStylePlugin } from './canvas-style.plugin';

describe('CanvasStylePlugin', () => {
  let plugin: CanvasStylePlugin;

  beforeEach(() => {
    plugin = new CanvasStylePlugin();
  });

  describe('getConfig', () => {
    it('should return proper schema in the object', async () => {
      const schema = await import('./canvas-style.schema').then(
        (module) => module.schema
      );
      const config = await lastValueFrom(plugin.getConfig?.());
      const result = await (config.schema as () => unknown)();

      expect(result).toEqual(schema);
    });
  });

  describe('getStyleProperties', () => {
    describe('when shadow is not set', () => {
      it('should return a LayoutStyleProperties object', async () => {
        const data = {
          radius: 'radius',
          border: 'border',
          background: 'background',
          fill: 'fill',
          zIndex: 4,
        };
        const styleProperties = [
          [{ background: data.background }],
          [{ 'border-radius': data.radius }],
          [{ border: data.border }],
          [{ '--oryx-fill': data.fill }],
          [{ 'z-index': data.zIndex }, { omitUnit: true }],
          [{ '--oryx-z-index': data.zIndex }, { omitUnit: true }],
        ];
        const result = await lastValueFrom(
          plugin.getStyleProperties({ styles: data, options: {} })
        );

        expect(result).toEqual(styleProperties);
      });
    });

    describe('when shadow is set to flat', () => {
      const data = {
        radius: 'radius',
        border: 'border',
        background: 'background',
        fill: 'fill',
        shadow: ShadowElevation.Flat,
      };
      let result: any;
      beforeEach(async () => {
        result = await lastValueFrom(
          plugin.getStyleProperties({ styles: data, options: {} })
        );
      });

      it('should return a LayoutStyleProperties object with shadow', () => {
        expect(result).toEqual([
          [
            {
              'box-shadow': 'var(--oryx-shadow-flat) var(--oryx-shadow-color)',
            },
          ],
          [{ background: 'background' }],
          [{ 'border-radius': 'radius' }],
          [{ border: 'border' }],
          [{ '--oryx-fill': 'fill' }],
        ]);
      });
    });
  });
});
