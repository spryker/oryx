import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { LayoutAttributes } from '@spryker-oryx/experience/layout';
import { Size } from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { of } from 'rxjs';
import { CompositionLayout } from '../models';
import {
  LayoutBuilder,
  LayoutPluginRenderParams,
  LayoutPluginType,
  LayoutService,
} from '../services';
import { LayoutController } from './layout.controller';

const mockLayoutBuilder = {
  createStylesFromOptions: vi.fn(),
};

const mockLayoutService = {
  getStyles: vi.fn(),
  getStylesFromOptions: vi.fn(),
  getRender: vi.fn(),
};

describe('LayoutController', () => {
  const setupController = (
    hostAttrs: LayoutAttributes & Record<string, unknown>
  ) =>
    new LayoutController({
      ...hostAttrs,
      hasAttribute: (name: string) => !!hostAttrs[name],
      getAttribute: (name: string) => hostAttrs[name],
    } as unknown as LitElement & LayoutAttributes);

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
    mockLayoutService.getStylesFromOptions.mockReturnValue(of(''));
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
        setupController({
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
        setupController({})
          .getStyles(
            ['bleed', 'layout', 'sticky'],
            [
              {
                layout: CompositionLayout.Grid,
                bleed: true,
              },
              {
                query: { breakpoint: Size.Xs },
                layout: CompositionLayout.Column,
                sticky: true,
              },
              {
                query: { breakpoint: Size.Lg },
                layout: CompositionLayout.Grid,
              },
              {
                query: { breakpoint: Size.Md },
                layout: CompositionLayout.Column,
                bleed: false,
              },
              {
                query: { breakpoint: Size.Xl },
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
        setupController({
          bleed: true,
          md: { layout: CompositionLayout.Column, bleed: false },
          xl: { layout: CompositionLayout.Carousel, sticky: true },
        })
          .getStyles(
            ['bleed', 'layout', 'sticky'],
            [
              { layout: CompositionLayout.Grid },
              {
                query: { breakpoint: Size.Xs },
                layout: CompositionLayout.Column,
                sticky: true,
              },
              {
                query: { breakpoint: Size.Lg },
                layout: CompositionLayout.Grid,
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
  });

  describe('collectStyles', () => {
    describe('when layout exist', () => {
      it('should return result from LayoutBuilder.createStylesFromOptions', () => {
        mockLayoutBuilder.createStylesFromOptions.mockReturnValue('result');
        const styles = setupController({}).collectStyles(
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
      const styles = setupController({}).collectStyles(['layout']);
      expect(styles).toBe(':host {display: contents;}\nresult');
    });
  });

  describe('when featureVersion >= 1.2', () => {
    beforeEach(() => {
      mockFeatureVersion('1.2');
    });

    describe('getStyles', () => {
      beforeEach(() => {
        mockLayoutService.getStyles.mockReturnValue(of());
      });

      describe('when there are layout component properties provided', () => {
        beforeEach(() => {
          setupController({
            layout: 'grid',
            'layout-bleed': true,
            xs: { layout: 'column', sticky: true },
            lg: { layout: 'grid' },
            md: { layout: 'column', bleed: false },
            xl: { layout: 'carousel', sticky: true },
          })
            .getStyles(['layout-bleed', 'layout-sticky'], [])
            .subscribe();
        });

        it('should call mockLayoutService.getStyle with proper params', () => {
          expect(mockLayoutService.getStyles).toHaveBeenCalledWith({
            bleed: { type: LayoutPluginType.Property, excluded: ['md'] },
            grid: {
              type: LayoutPluginType.Layout,
              excluded: ['xs', 'md', 'xl'],
            },
            column: { type: LayoutPluginType.Layout, included: ['xs', 'md'] },
            carousel: { type: LayoutPluginType.Layout, included: ['xl'] },
            sticky: { type: LayoutPluginType.Property, included: ['xs', 'xl'] },
          });
        });
      });

      describe('when there are layout options provided', () => {
        beforeEach(() => {
          setupController({})
            .getStyles(
              [],
              [
                {
                  layout: {
                    type: 'grid',
                    bleed: true,
                  },
                },
                {
                  query: { breakpoint: Size.Xs },
                  layout: {
                    type: 'column',
                    sticky: true,
                  },
                },
                {
                  query: { breakpoint: Size.Lg },
                  layout: 'grid',
                },
                {
                  query: { breakpoint: Size.Md },
                  layout: {
                    type: 'column',
                    bleed: false,
                  },
                },
                {
                  query: { breakpoint: Size.Xl },
                  layout: {
                    type: 'carousel',
                    sticky: true,
                  },
                },
              ]
            )
            .subscribe();
        });

        it('should call mockLayoutService.getStyle with proper params', () => {
          expect(mockLayoutService.getStyles).toHaveBeenCalledWith({
            grid: {
              type: LayoutPluginType.Layout,
              excluded: ['xs', 'md', 'xl'],
            },
            column: { type: LayoutPluginType.Layout, included: ['xs', 'md'] },
            carousel: { type: LayoutPluginType.Layout, included: ['xl'] },
            bleed: { type: LayoutPluginType.Property, excluded: ['md'] },
            sticky: { type: LayoutPluginType.Property, included: ['xs', 'xl'] },
          });
        });
      });

      describe('when theres a mix of layout component properties and options provided', () => {
        beforeEach(() => {
          setupController({
            'layout-bleed': true,
            md: { layout: 'column', bleed: false },
            xl: { layout: 'carousel', sticky: true },
          })
            .getStyles(
              ['layout-bleed', 'layout-sticky'],
              [
                { layout: 'grid' },
                {
                  query: { breakpoint: Size.Xs },
                  layout: {
                    type: 'column',
                    sticky: true,
                  },
                },
                {
                  query: { breakpoint: Size.Lg },
                  layout: 'grid',
                },
              ]
            )
            .subscribe();
        });

        it('should call mockLayoutService.getStyle with proper params', () => {
          expect(mockLayoutService.getStyles).toHaveBeenCalledWith({
            bleed: { type: LayoutPluginType.Property, excluded: ['md'] },
            grid: {
              type: LayoutPluginType.Layout,
              excluded: ['xs', 'md', 'xl'],
            },
            column: { type: LayoutPluginType.Layout, included: ['xs', 'md'] },
            carousel: { type: LayoutPluginType.Layout, included: ['xl'] },
            sticky: { type: LayoutPluginType.Property, included: ['xs', 'xl'] },
          });
        });
      });
    });

    describe('getRender', () => {
      const mockData = {
        element: 'element',
        experience: 'experience',
      } as unknown as Omit<LayoutPluginRenderParams, 'options'>;

      beforeEach(() => {
        mockLayoutService.getRender.mockReturnValue(of());
      });

      describe('when there are layout component properties provided', () => {
        beforeEach(() => {
          setupController({
            layout: 'grid',
            'layout-bleed': true,
            layoutXs: { layout: 'column', sticky: true },
            layoutLg: { layout: 'grid' },
            layoutMd: { layout: 'column', bleed: false, overlap: true },
            layoutXl: { layout: 'carousel', sticky: true },
          })
            .getRender({
              attrs: ['layout-bleed', 'layout-sticky'],
              place: 'pre',
              screen: Size.Md,
              data: mockData,
            })
            .subscribe();
        });

        it('mockLayoutService.getRender with proper params', () => {
          const options = { bleed: false, layout: 'column', overlap: true };

          expect(mockLayoutService.getRender).toHaveBeenCalledWith({
            token: 'column',
            type: LayoutPluginType.Layout,
            data: { ...mockData, options },
          });
          expect(mockLayoutService.getRender).toHaveBeenCalledWith({
            token: 'overlap',
            type: LayoutPluginType.Property,
            data: { ...mockData, options },
          });
          expect(mockLayoutService.getRender).not.toHaveBeenCalledWith({
            token: 'bleed',
            type: LayoutPluginType.Property,
            data: { ...mockData, options },
          });
        });
      });

      describe('when there are layout options provided', () => {
        beforeEach(() => {
          setupController({})
            .getRender({
              attrs: ['layout-bleed', 'layout-sticky'],
              place: 'pre',
              screen: Size.Md,
              data: {
                ...mockData,
                options: {
                  rules: [
                    {
                      layout: {
                        type: 'grid',
                        bleed: true,
                      },
                    },
                    {
                      query: { breakpoint: Size.Xs },
                      layout: {
                        type: 'column',
                        sticky: true,
                      },
                    },
                    {
                      query: { breakpoint: Size.Lg },
                      layout: 'grid',
                    },
                    {
                      query: { breakpoint: Size.Md },
                      layout: {
                        type: 'column',
                        bleed: false,
                        overlap: true,
                      },
                    },
                    {
                      query: { breakpoint: Size.Xl },
                      layout: {
                        type: 'carousel',
                        sticky: true,
                      },
                    },
                  ],
                },
              },
            })
            .subscribe();
        });

        it('mockLayoutService.getRender with proper params', () => {
          const options = { bleed: false, layout: 'column', overlap: true };

          expect(mockLayoutService.getRender).toHaveBeenCalledWith({
            token: 'column',
            type: LayoutPluginType.Layout,
            data: { ...mockData, options },
          });
          expect(mockLayoutService.getRender).toHaveBeenCalledWith({
            token: 'overlap',
            type: LayoutPluginType.Property,
            data: { ...mockData, options },
          });
          expect(mockLayoutService.getRender).not.toHaveBeenCalledWith({
            token: 'bleed',
            type: LayoutPluginType.Property,
            data: { ...mockData, options },
          });
        });
      });

      describe('when theres a mix of layout component properties and options provided', () => {
        beforeEach(() => {
          setupController({
            'layout-bleed': true,
            md: { layout: 'column', bleed: false },
            xl: { layout: 'carousel', sticky: true },
          })
            .getRender({
              attrs: ['layout-bleed', 'layout-sticky'],
              place: 'pre',
              screen: Size.Md,
              data: {
                ...mockData,
                options: {
                  rules: [
                    { layout: 'grid' },
                    {
                      query: { breakpoint: Size.Xs },
                      layout: {
                        type: 'column',
                        sticky: true,
                      },
                    },
                    {
                      query: { breakpoint: Size.Lg },
                      layout: 'grid',
                    },
                  ],
                },
              },
            })
            .subscribe();
        });

        it('mockLayoutService.getRender with proper params', () => {
          const options = { layout: 'grid', bleed: true };

          expect(mockLayoutService.getRender).toHaveBeenCalledWith({
            token: 'grid',
            type: LayoutPluginType.Layout,
            data: { ...mockData, options },
          });
          expect(mockLayoutService.getRender).toHaveBeenCalledWith({
            token: 'bleed',
            type: LayoutPluginType.Property,
            data: { ...mockData, options },
          });
        });
      });
    });
  });
});
