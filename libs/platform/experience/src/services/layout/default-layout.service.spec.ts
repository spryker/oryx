import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { Size } from '@spryker-oryx/utilities';
import { CSSResult } from 'lit';
import { lastValueFrom } from 'rxjs';
import { CompositionLayout } from '../../models';
import { DefaultLayoutService } from './default-layout.service';
import { LayoutService } from './layout.service';
import { ScreenService } from './screen.service';

const mockLayoutService = {
  getScreenMedia: vi.fn(),
};

const layout = {
  bleed: './styles/bleed.styles',
  sticky: './styles/sticky.styles',
  divider: './styles/divider.styles',
  overlap: './styles/overlap.styles',
  [CompositionLayout.Column]: './styles/column-layout.styles',
  [CompositionLayout.Grid]: './styles/grid-layout.styles',
  [CompositionLayout.Carousel]: './styles/carousel-layout.styles',
  [CompositionLayout.Flex]: './styles/flex-layout.styles',
  [CompositionLayout.Split]: './styles/split-layout.styles',
  [CompositionLayout.SplitMain]: './styles/split-main.styles',
  [CompositionLayout.SplitAside]: './styles/split-aside.styles',
  [CompositionLayout.Text]: './styles/text-layout.styles',
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
      const promise = service.getStyles({ layout: {} });
      const expected = (
        await import('./styles/base.styles').then((module) => module.styles)
      ).toString();
      const styles = await lastValueFrom(promise);
      expect(styles).toBe(expected);
    });

    Object.entries(layout).forEach(([key, path]) => {
      it(`should resolve ${key} styles`, async () => {
        const promise = service.getStyles({ [key]: {} });
        const common = (
          await import('./styles/base.styles').then((module) => module.styles)
        ).toString();
        const layoutStyles = Object.values(
          await import(path).then((module) => module.styles)
        ).reduce(
          (acc: string, style) => acc + (style as CSSResult).toString(),
          ''
        );
        const styles = await lastValueFrom(promise);
        expect(styles).toBe(`${common}${layoutStyles}`);
      });
    });

    Object.entries(layout).forEach(([key, path]) => {
      it(`should resolve ${key} styles by breakpoint`, async () => {
        mockLayoutService.getScreenMedia.mockReturnValue('@media');
        const promise = service.getStyles({
          [key]: { included: [Size.Md], excluded: [Size.Lg] },
        });
        const common = (
          await import('./styles/base.styles').then((module) => module.styles)
        ).toString();
        const layoutStyles = Object.values(
          await import(path).then((module) => module.styles)
        ).reduce(
          (acc: string, style) =>
            acc + `@media {${(style as CSSResult).toString()}}\n`,
          ''
        );
        const styles = await lastValueFrom(promise);
        expect(mockLayoutService.getScreenMedia).toHaveBeenCalledWith(
          [Size.Md],
          [Size.Lg]
        );
        expect(styles).toBe(`${common}${layoutStyles}`);
      });
    });
  });
});
