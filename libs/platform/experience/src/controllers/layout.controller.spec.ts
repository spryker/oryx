import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { LayoutAttributes } from '@spryker-oryx/experience/layout';
import { Size } from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { CompositionLayout } from '../models';
import { LayoutBuilder } from '../services';
import { LayoutController } from './layout.controller';

const mockLayoutBuilder = {
  createStylesFromOptions: vi.fn(),
};

describe('DefaultScreenService', () => {
  const setup = (host: LayoutAttributes) =>
    new LayoutController(host as LitElement & LayoutAttributes);

  beforeEach(() => {
    createInjector({
      providers: [
        {
          provide: LayoutBuilder,
          useValue: mockLayoutBuilder,
        },
      ],
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
    destroyInjector();
  });

  describe('getLayoutInfos', () => {
    it('should return proper ResponsiveLayoutInfo from host', () => {
      const info = setup({
        layout: CompositionLayout.Grid,
        bleed: true,
        xs: { layout: CompositionLayout.Column, sticky: true },
        lg: { layout: CompositionLayout.Grid },
        md: { layout: CompositionLayout.Column, bleed: false },
        xl: { layout: CompositionLayout.Carousel, sticky: true },
      }).getLayoutInfos(['bleed', 'layout', 'sticky']);

      expect(info).toEqual({
        bleed: { excluded: ['md'] },
        grid: { excluded: ['xs', 'md', 'xl'] },
        column: { included: ['xs', 'md'] },
        carousel: { included: ['xl'] },
        sticky: { included: ['xs', 'xl'] },
      });
    });

    it('should return proper ResponsiveLayoutInfo from rules', () => {
      const info = setup({}).getLayoutInfos(
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
      );

      expect(info).toEqual({
        bleed: { excluded: ['md'] },
        grid: { excluded: ['xs', 'md', 'xl'] },
        column: { included: ['xs', 'md'] },
        carousel: { included: ['xl'] },
        sticky: { included: ['xs', 'xl'] },
      });
    });

    it('should return proper ResponsiveLayoutInfo from mixed content', () => {
      const info = setup({
        bleed: true,
        md: { layout: CompositionLayout.Column, bleed: false },
        xl: { layout: CompositionLayout.Carousel, sticky: true },
      }).getLayoutInfos(
        ['bleed', 'layout', 'sticky'],
        [
          {
            layout: CompositionLayout.Grid,
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
        ]
      );

      expect(info).toEqual({
        bleed: { excluded: ['md'] },
        grid: { excluded: ['xs', 'md', 'xl'] },
        column: { included: ['xs', 'md'] },
        carousel: { included: ['xl'] },
        sticky: { included: ['xs', 'xl'] },
      });
    });
  });

  describe('collectStyles', () => {
    describe('when layout exist', () => {
      describe('and uid is not provided', () => {
        it('should return empty string', () => {
          const styles = setup({
            layout: CompositionLayout.Grid,
          }).collectStyles(['layout']);

          expect(
            mockLayoutBuilder.createStylesFromOptions
          ).not.toHaveBeenCalled();
          expect(styles).toBe('');

          expect(
            setup({
              xs: { bleed: true },
            }).collectStyles(['bleed'])
          ).toBe('');
        });
      });

      describe('and uid is provided', () => {
        it('should return result from LayoutBuilder.createStylesFromOptions', () => {
          mockLayoutBuilder.createStylesFromOptions.mockReturnValue('result');
          const styles = setup({}).collectStyles(
            ['layout'],
            [{ layout: CompositionLayout.Carousel }],
            'uid'
          );

          expect(
            mockLayoutBuilder.createStylesFromOptions
          ).toHaveBeenCalledWith('uid', [
            { layout: CompositionLayout.Carousel },
          ]);
          expect(styles).toBe('result');
        });
      });
    });
  });

  describe('when layout is not exist', () => {
    describe('and uid is not provided', () => {
      it('should return default styles for hosts', () => {
        const styles = setup({}).collectStyles(['layout']);

        expect(
          mockLayoutBuilder.createStylesFromOptions
        ).not.toHaveBeenCalled();
        expect(styles).toBe(':host {display: contents;}\n');
      });
    });

    describe('and uid is provided', () => {
      it('should return combine result from LayoutBuilder.createStylesFromOptions with default styles for host', () => {
        mockLayoutBuilder.createStylesFromOptions.mockReturnValue('result');
        const styles = setup({}).collectStyles(
          ['bleed'],
          [{ layout: CompositionLayout.Carousel }],
          'uid'
        );

        expect(mockLayoutBuilder.createStylesFromOptions).toHaveBeenCalledWith(
          'uid',
          [{ layout: CompositionLayout.Carousel }]
        );
        expect(styles).toBe(':host {display: contents;}\nresult');
      });
    });
  });
});
