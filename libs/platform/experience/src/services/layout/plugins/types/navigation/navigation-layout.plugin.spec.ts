import { lastValueFrom } from 'rxjs';
import { LayoutStyles } from '../../../layout.model';
import { NavigationLayoutPlugin } from './navigation-layout.plugin';

describe('NavigationLayoutPlugin', () => {
  let plugin: NavigationLayoutPlugin;

  beforeEach(() => {
    plugin = new NavigationLayoutPlugin();
  });

  describe('getStyles', () => {
    let layoutStyles: { styles: string };
    let result: LayoutStyles;

    describe('when vertical is false', () => {
      beforeEach(async () => {
        layoutStyles = await import('./navigation-layout.styles').then(
          (module) => {
            return {
              styles: `${module.styles.styles}${module.horizontalStyles}`,
            };
          }
        );
        result = await lastValueFrom(
          plugin.getStyles({ options: { vertical: false } })
        );
      });

      it('should return an Observable of LayoutStyles', async () => {
        expect(result).toEqual(layoutStyles);
      });
    });

    describe('when vertical is true', () => {
      beforeEach(async () => {
        layoutStyles = await import('./navigation-layout.styles').then(
          (module) => {
            return {
              styles: `${module.styles.styles}${module.verticalStyles}`,
            };
          }
        );

        result = await lastValueFrom(
          plugin.getStyles({ options: { vertical: true } })
        );
      });

      it('should return an Observable of LayoutStyles', async () => {
        expect(result).toEqual(layoutStyles);
      });
    });
  });

  describe('getConfig', () => {
    it('should return proper schema in the object', async () => {
      const schema = await import('./navigation-layout.schema').then(
        (module) => module.schema
      );
      const config = await lastValueFrom(plugin.getConfig?.());
      const result = await (config.schema as () => unknown)();

      expect(result).toEqual(schema);
    });
  });
});
