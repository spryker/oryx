import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { LayoutAttributes } from '@spryker-oryx/experience/layout';
import { Size } from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { of } from 'rxjs';
import { CompositionLayout } from '../models';
import { LayoutBuilder, LayoutService } from '../services';
import { LayoutController } from './layout.controller';

const mockLayoutBuilder = {
  createStylesFromOptions: vi.fn(),
};

const mockLayoutService = {
  getStyles: vi.fn(),
};

describe('DefaultScreenService', () => {
  const setupControlller = (host: LayoutAttributes) =>
    new LayoutController(host as LitElement & LayoutAttributes);

  beforeEach(() => {
    createInjector({
      providers: [
        {
          provide: LayoutBuilder,
          useValue: mockLayoutBuilder,
        },
        {
          provide: LayoutService,
          useValue: mockLayoutService,
        },
      ],
    });
    mockLayoutService.getStyles.mockImplementation((infos) => infos);
  });

  afterEach(() => {
    vi.resetAllMocks();
    destroyInjector();
  });

  describe('getLayoutInfos', () => {
    beforeEach(() => {
      mockLayoutService.getStyles.mockReturnValue(of());
    });

    describe('when there are layout component properties provided', () => {
      beforeEach(() => {
        setupControlller({
          layout: CompositionLayout.Grid,
          bleed: true,
          xs: { layout: CompositionLayout.Column, sticky: true },
          lg: { layout: CompositionLayout.Grid },
          md: { layout: CompositionLayout.Column, bleed: false },
          xl: { layout: CompositionLayout.Carousel, sticky: true },
        })
          .getStyles(['bleed', 'layout', 'sticky'])
          .subscribe();
      });

      it('should generate the infos', () => {
        expect(mockLayoutService.getStyles).toHaveBeenCalledWith({
          bleed: { excluded: ['md'] },
          grid: { excluded: ['xs', 'md', 'xl'] },
          column: { included: ['xs', 'md'] },
          carousel: { included: ['xl'] },
          sticky: { included: ['xs', 'xl'] },
        });
      });
    });

    describe('and there are layout options provided', () => {
      beforeEach(() => {
        setupControlller({})
          .getStyles(
            ['bleed', 'layout', 'sticky'],
            [
              {
                layout: CompositionLayout.Grid,
                bleed: true,
              },
              {
                breakpoint: Size.Xs,
                layout: CompositionLayout.Column,
                sticky: true,
              },
              {
                breakpoint: Size.Lg,
                layout: CompositionLayout.Grid,
              },
              {
                breakpoint: Size.Md,
                layout: CompositionLayout.Column,
                bleed: false,
              },
              {
                breakpoint: Size.Xl,
                layout: CompositionLayout.Carousel,
                sticky: true,
              },
            ]
          )
          .subscribe();
      });

      it('should generate the infos', () => {
        expect(mockLayoutService.getStyles).toHaveBeenCalledWith({
          bleed: { excluded: ['md'] },
          grid: { excluded: ['xs', 'md', 'xl'] },
          column: { included: ['xs', 'md'] },
          carousel: { included: ['xl'] },
          sticky: { included: ['xs', 'xl'] },
        });
      });
    });

    describe('and theres a mix of layout component properties and options provided', () => {
      beforeEach(() => {
        setupControlller({
          bleed: true,
          md: { layout: CompositionLayout.Column, bleed: false },
          xl: { layout: CompositionLayout.Carousel, sticky: true },
        })
          .getStyles(
            ['bleed', 'layout', 'sticky'],
            [
              { layout: CompositionLayout.Grid },
              {
                breakpoint: Size.Xs,
                layout: CompositionLayout.Column,
                sticky: true,
              },
              { breakpoint: Size.Lg, layout: CompositionLayout.Grid },
            ]
          )
          .subscribe();
      });

      it('should generate the infos', () => {
        expect(mockLayoutService.getStyles).toHaveBeenCalledWith({
          bleed: { excluded: ['md'] },
          grid: { excluded: ['xs', 'md', 'xl'] },
          column: { included: ['xs', 'md'] },
          carousel: { included: ['xl'] },
          sticky: { included: ['xs', 'xl'] },
        });
      });
    });
  });

  describe('collectStyles', () => {
    describe('when layout exist', () => {
      it('should return result from LayoutBuilder.createStylesFromOptions', () => {
        mockLayoutBuilder.createStylesFromOptions.mockReturnValue('result');
        const styles = setupControlller({}).collectStyles(
          ['layout'],
          [{ layout: CompositionLayout.Carousel }],
          'uid'
        );

        expect(mockLayoutBuilder.createStylesFromOptions).toHaveBeenCalledWith(
          [{ layout: CompositionLayout.Carousel }],
          'uid'
        );
        expect(styles).toBe('result');
      });
    });
  });

  describe('when layout is not exist', () => {
    beforeEach(() => {
      mockLayoutBuilder.createStylesFromOptions.mockReturnValue('result');
    });

    it('should return default styles for hosts', () => {
      const styles = setupControlller({}).collectStyles(['layout']);
      expect(styles).toBe(':host {display: contents;}\nresult');
    });
  });
});
