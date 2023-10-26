import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { Size } from '@spryker-oryx/utilities';
import { lastValueFrom, of } from 'rxjs';
import { DefaultLayoutService } from './default-layout.service';
import { LayoutService } from './layout.service';
import {
  LayoutPlugin,
  LayoutPluginParams,
  LayoutPluginType,
  LayoutPropertyPlugin,
} from './plugins';
import { ScreenService } from './screen.service';

const mockLayoutService = {
  getScreenMedia: vi.fn(),
};

const aLayoutPlugin = {
  getStyles: vi.fn(),
  getRender: vi.fn(),
  getStyleProperties: vi.fn(),
};

const aLayoutPropertyPlugin = {
  getStyles: vi.fn(),
  getRender: vi.fn(),
  getStyleProperties: vi.fn(),
};

describe('DefaultLayoutService', () => {
  let service: LayoutService;

  beforeEach(() => {
    createInjector({
      providers: [
        {
          provide: LayoutService,
          useClass: DefaultLayoutService,
        },
        {
          provide: ScreenService,
          useValue: mockLayoutService,
        },
        {
          provide: `${LayoutPlugin}a`,
          useValue: aLayoutPlugin,
        },
        {
          provide: `${LayoutPropertyPlugin}a`,
          useValue: aLayoutPropertyPlugin,
        },
      ],
    });

    service = getInjector().inject(LayoutService);
  });

  afterEach(() => {
    vi.resetAllMocks();
    destroyInjector();
  });

  describe('getStyles', () => {
    it('should resolve common styles', async () => {
      const promise = service.getStyles({
        layout: { type: LayoutPluginType.Layout },
      });
      const expected = (
        await import('./base.styles').then((module) => module.styles)
      ).toString();
      const styles = await lastValueFrom(promise);
      expect(styles).toBe(expected);
    });

    it('should resolve styles from layout plugin', async () => {
      const pluginStyles = { styles: 'a-styles' };
      aLayoutPlugin.getStyles.mockReturnValue(of(pluginStyles));
      const promise = service.getStyles({
        a: { type: LayoutPluginType.Layout },
      });
      const styles = await lastValueFrom(promise);
      expect(aLayoutPlugin.getStyles).toHaveBeenCalled();
      expect(styles).toContain(pluginStyles.styles);
    });

    it('should resolve styles from layout property plugin', async () => {
      const pluginStyles = { styles: 'a-styles' };
      aLayoutPropertyPlugin.getStyles.mockReturnValue(of(pluginStyles));
      const promise = service.getStyles({
        a: { type: LayoutPluginType.Property },
      });
      const styles = await lastValueFrom(promise);
      expect(aLayoutPropertyPlugin.getStyles).toHaveBeenCalled();
      expect(styles).toContain(pluginStyles.styles);
    });

    it('should resolve styles from layout plugin by breakpoints', async () => {
      const pluginStyles = { styles: 'styles', sm: 'a-styles' };
      aLayoutPlugin.getStyles.mockReturnValue(of(pluginStyles));
      mockLayoutService.getScreenMedia.mockReturnValue('@media');
      const promise = service.getStyles({
        a: {
          type: LayoutPluginType.Layout,
          included: [Size.Md],
          excluded: [Size.Lg],
        },
      });
      const styles = await lastValueFrom(promise);
      expect(mockLayoutService.getScreenMedia).toHaveBeenNthCalledWith(
        1,
        [Size.Md],
        [Size.Lg]
      );
      expect(mockLayoutService.getScreenMedia).toHaveBeenNthCalledWith(
        2,
        Size.Sm
      );

      expect(aLayoutPlugin.getStyles).toHaveBeenCalled();
      expect(styles).toContain(`@media {${pluginStyles.styles}}`);
      expect(styles).toContain(`@media {${pluginStyles.sm}}`);
    });
  });

  const methods = [
    { name: 'getRender', text: 'render' },
    { name: 'getStyleProperties', text: 'style properties' },
  ];

  methods.forEach(({ name, text }) =>
    describe(name, () => {
      it(`should resolve ${text} from layout plugin`, () => {
        const _name = name as keyof typeof aLayoutPlugin;
        const mockData = 'mockData';
        aLayoutPlugin[_name].mockReturnValue(mockData);
        const result = service[
          name as Exclude<keyof typeof service, 'getStyles'>
        ]({
          token: 'a',
          type: LayoutPluginType.Layout,
          data: mockData as LayoutPluginParams,
        });

        expect(aLayoutPlugin[_name]).toHaveBeenCalledWith(mockData);
        expect(result).toBe(mockData);
      });

      it(`should resolve ${text} from layout property plugin`, () => {
        const _name = name as keyof typeof aLayoutPropertyPlugin;
        const mockData = 'mockData';
        aLayoutPropertyPlugin[_name].mockReturnValue(mockData);
        const result = service[
          name as Exclude<keyof typeof service, 'getStyles'>
        ]({
          token: 'a',
          type: LayoutPluginType.Property,
          data: mockData as LayoutPluginParams,
        });

        expect(aLayoutPropertyPlugin[_name]).toHaveBeenCalledWith(mockData);
        expect(result).toBe(mockData);
      });
    })
  );
});
