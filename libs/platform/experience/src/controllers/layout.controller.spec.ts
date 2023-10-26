import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { LayoutAttributes } from '@spryker-oryx/experience/layout';
import { Size } from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { of } from 'rxjs';
import {
  LayoutBuilder,
  LayoutPluginParams,
  LayoutPluginType,
  LayoutService,
} from '../services';
import { LayoutController } from './layout.controller';

const mockLayoutBuilder = {
  createStylesFromOptions: vi.fn(),
};

const mockLayoutService = {
  getStyles: vi.fn(),
  getRender: vi.fn(),
};

describe('DefaultScreenService', () => {
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
  });

  afterEach(() => {
    vi.resetAllMocks();
    destroyInjector();
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
          grid: { type: LayoutPluginType.Layout, excluded: ['xs', 'md', 'xl'] },
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
          grid: { type: LayoutPluginType.Layout, excluded: ['xs', 'md', 'xl'] },
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
          grid: { type: LayoutPluginType.Layout, excluded: ['xs', 'md', 'xl'] },
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
    } as unknown as Omit<LayoutPluginParams, 'options'>;

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
        }).getRender({
          attrs: ['layout-bleed', 'layout-sticky'],
          place: 'pre',
          screen: Size.Md,
          data: mockData,
        });
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
        setupController({}).getRender({
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
        });
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
        }).getRender({
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
        });
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

  describe('collectStyles', () => {
    describe('when layout exist', () => {
      it('should return result from LayoutBuilder.createStylesFromOptions', () => {
        mockLayoutBuilder.createStylesFromOptions.mockReturnValue('result');
        const styles = setupController({}).collectStyles(
          ['layout'],
          [{ layout: 'carousel' }],
          'uid'
        );

        expect(mockLayoutBuilder.createStylesFromOptions).toHaveBeenCalledWith(
          [{ layout: 'carousel' }],
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
});
