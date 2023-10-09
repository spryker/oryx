import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { LayoutBuilder, LayoutService } from '@spryker-oryx/experience';
import { FacetType } from '@spryker-oryx/product';
import { RouterService } from '@spryker-oryx/router';
import {
  FacetComponentRegistryService,
  FacetListService,
} from '@spryker-oryx/search';
import {
  SelectFacetEventDetail,
  SelectRangeFacetValue,
} from '@spryker-oryx/search/facet';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { SearchFacetNavigationComponent } from './facet-navigation.component';
import { searchFacetNavigationComponent } from './facet-navigation.def';

const mockCategoryFacet = {
  name: 'Categories',
  parameter: 'category',
  type: FacetType.Single,
  values: [
    {
      value: 2,
      selected: false,
      count: 28,
      name: 'Cameras & Camcorders',
      children: [
        {
          value: 4,
          selected: false,
          count: 27,
          name: 'Digital Cameras',
          children: [],
        },
        {
          value: 3,
          selected: false,
          count: 1,
          name: 'Camcorders',
          children: [],
        },
      ],
    },
  ],
};

const mockMultiValuedFacet = {
  name: 'Color',
  parameter: 'color',
  type: FacetType.Multi,
  values: [
    {
      value: 'Black',
      selected: false,
      count: 11,
    },
    {
      value: 'Silver',
      selected: false,
      count: 7,
    },
    {
      value: 'Red',
      selected: false,
      count: 6,
    },
  ],
};

const mockFacet = {
  name: 'Mock',
  parameter: 'mock',
  count: null,
  values: [
    {
      value: 'Mock',
      selected: false,
      count: 11,
    },
  ],
};

const mockRangeFacet = {
  type: 'range',
  parameter: 'mock',
  name: 'Mock',
  values: {
    max: 100,
    min: 0,
    selected: {
      max: 100,
      min: 0,
    },
  },
};

class MockFacetListService implements Partial<FacetListService> {
  get = vi.fn().mockReturnValue(of(null));
  getRangeFacetParams = vi.fn().mockReturnValue({
    min: 'mock1',
    max: 'mock2',
  });
}

class MockRouterService implements Partial<RouterService> {
  getUrl = vi.fn().mockReturnValue(of(''));
  getPathId = vi.fn().mockReturnValue('');
  navigate = vi.fn();
}

class MockLayoutService implements Partial<LayoutService> {
  getStyles = vi.fn().mockReturnValue(of(null));
}

class MockLayoutBuilder implements Partial<LayoutBuilder> {
  createStylesFromOptions = vi.fn();
}

class MockFacetComponentRegistryService
  implements Partial<FacetComponentRegistryService>
{
  renderFacetComponent = vi.fn().mockReturnValue(html``);
}

describe('SearchFacetNavigationComponent', () => {
  let element: SearchFacetNavigationComponent;
  let listService: MockFacetListService;
  let renderService: MockFacetComponentRegistryService;
  let layoutService: MockLayoutService;
  let routerService: MockRouterService;

  beforeAll(async () => {
    await useComponent(searchFacetNavigationComponent);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: FacetListService,
          useClass: MockFacetListService,
        },
        {
          provide: RouterService,
          useClass: MockRouterService,
        },
        {
          provide: FacetComponentRegistryService,
          useClass: MockFacetComponentRegistryService,
        },
        {
          provide: LayoutService,
          useClass: MockLayoutService,
        },
        {
          provide: LayoutBuilder,
          useClass: MockLayoutBuilder,
        },
      ],
    });

    listService = testInjector.inject(
      FacetListService
    ) as unknown as MockFacetListService;
    renderService = testInjector.inject(
      FacetComponentRegistryService
    ) as unknown as MockFacetComponentRegistryService;
    layoutService = testInjector.inject(
      LayoutService
    ) as unknown as MockLayoutService;
    routerService = testInjector.inject(
      RouterService
    ) as unknown as MockRouterService;

    element = await fixture(
      html`<oryx-search-facet-navigation></oryx-search-facet-navigation>`
    );
  });

  afterEach(() => {
    destroyInjector();
    vi.resetAllMocks();
  });

  it('is defined', () => {
    expect(element).toBeInstanceOf(SearchFacetNavigationComponent);
  });

  it('should not render the content', () => {
    expect(renderService.renderFacetComponent).not.toHaveBeenCalled();
    expect(layoutService.getStyles).not.toHaveBeenCalled();
  });

  describe('when facets list is empty', () => {
    beforeEach(async () => {
      listService.get = vi.fn().mockReturnValue(of([]));
      element = await fixture(
        html`<oryx-search-facet-navigation></oryx-search-facet-navigation>`
      );
    });

    it('should not render the content', () => {
      expect(renderService.renderFacetComponent).not.toHaveBeenCalled();
    });
  });

  describe('when facets are provided', () => {
    beforeEach(async () => {
      listService.get = vi.fn().mockReturnValue(of([mockFacet]));
      element = await fixture(
        html`<oryx-search-facet-navigation></oryx-search-facet-navigation>`
      );
    });

    it('should render the facet component with default config', () => {
      expect(renderService.renderFacetComponent).toHaveBeenCalledWith(
        mockFacet,
        {
          renderLimit: 5,
          open: true,
          minForSearch: 13,
          enableClear: true,
        },
        expect.any(Function)
      );
    });

    it('should should render layout styles', () => {
      expect(layoutService.getStyles).toHaveBeenCalled();
    });

    describe('and "expandedItemsCount" is less then facets count', () => {
      beforeEach(async () => {
        listService.get = vi.fn().mockReturnValue(of([mockFacet]));
        element = await fixture(
          html`<oryx-search-facet-navigation
            .options=${{ expandedItemsCount: 0 }}
          ></oryx-search-facet-navigation>`
        );
      });

      it('should render the facet in "closed" state', () => {
        expect(renderService.renderFacetComponent).toHaveBeenCalledWith(
          mockFacet,
          expect.objectContaining({
            open: false,
          }),
          expect.any(Function)
        );
      });
    });

    describe('and facet has parameter equals to "category"', () => {
      beforeEach(async () => {
        listService.get = vi.fn().mockReturnValue(of([mockCategoryFacet]));
        element = await fixture(
          html`<oryx-search-facet-navigation></oryx-search-facet-navigation>`
        );
      });

      it('should not prevent clear', () => {
        expect(renderService.renderFacetComponent).toHaveBeenCalledWith(
          mockCategoryFacet,
          expect.objectContaining({
            enableClear: true,
          }),
          expect.any(Function)
        );
      });

      describe('and route`s pathId equals to "category"', () => {
        beforeEach(async () => {
          listService.get = vi.fn().mockReturnValue(of([mockCategoryFacet]));
          routerService.getPathId = vi.fn().mockReturnValue('category');
          element = await fixture(
            html`<oryx-search-facet-navigation></oryx-search-facet-navigation>`
          );
        });

        it('should prevent clear', () => {
          expect(renderService.renderFacetComponent).toHaveBeenCalledWith(
            mockCategoryFacet,
            expect.objectContaining({
              enableClear: false,
            }),
            expect.any(Function)
          );
        });
      });
    });

    describe('and valueRenderLimit is provided', () => {
      const valueRenderLimit = 2;
      beforeEach(async () => {
        listService.get = vi.fn().mockReturnValue(of([mockFacet]));
        element = await fixture(
          html`<oryx-search-facet-navigation
            .options=${{ valueRenderLimit }}
          ></oryx-search-facet-navigation>`
        );
      });

      it('should pass the limit to the render function', () => {
        expect(renderService.renderFacetComponent).toHaveBeenCalledWith(
          mockFacet,
          expect.objectContaining({
            renderLimit: valueRenderLimit,
          }),
          expect.any(Function)
        );
      });
    });

    describe('and minForSearch is provided', () => {
      const minForSearch = 2;
      beforeEach(async () => {
        listService.get = vi.fn().mockReturnValue(of([mockFacet]));
        element = await fixture(
          html`<oryx-search-facet-navigation
            .options=${{ minForSearch }}
          ></oryx-search-facet-navigation>`
        );
      });

      it('should pass the min search value to the render function', () => {
        expect(renderService.renderFacetComponent).toHaveBeenCalledWith(
          mockFacet,
          expect.objectContaining({
            minForSearch,
          }),
          expect.any(Function)
        );
      });
    });

    describe('and bury options is provided', () => {
      beforeEach(async () => {
        listService.get = vi
          .fn()
          .mockReturnValue(of([mockCategoryFacet, mockFacet]));
        element = await fixture(
          html`<oryx-search-facet-navigation
            .options=${{ bury: [{ facets: [mockFacet.parameter] }] }}
          ></oryx-search-facet-navigation>`
        );
      });

      it('should render filtered facets', async () => {
        expect(renderService.renderFacetComponent).toHaveBeenLastCalledWith(
          mockCategoryFacet,
          expect.any(Object),
          expect.any(Function)
        );
      });
    });
  });

  describe('when filters are applied', () => {
    let listener: (e: CustomEvent<SelectFacetEventDetail>) => void;

    const setupListener = () => {
      renderService.renderFacetComponent = vi
        .fn()
        .mockImplementation(
          (
            facet,
            options,
            selectListener: (e: CustomEvent<SelectFacetEventDetail>) => void
          ) => {
            listener = selectListener;
            return html``;
          }
        );
    };

    const callListener = (detail: SelectFacetEventDetail) => {
      const mockedEvent = new CustomEvent<SelectFacetEventDetail>('event', {
        detail,
      });
      listener(mockedEvent);
    };

    beforeEach(async () => {
      setupListener();
      listService.get = vi.fn().mockReturnValue(of([mockFacet]));
      element = await fixture(
        html`<oryx-search-facet-navigation></oryx-search-facet-navigation>`
      );
    });

    describe('and there is no pathId for selected facet', () => {
      beforeEach(() => {
        callListener({
          name: mockFacet.name,
          value: mockFacet.values[0],
        });
      });

      it('should get route pathId based on facet parameter', () => {
        expect(routerService.getPathId).toHaveBeenCalledWith(
          mockFacet.parameter
        );
      });

      it('should get the url and navigate to it', () => {
        expect(routerService.getUrl).toHaveBeenCalledWith(
          '',
          expect.objectContaining({
            queryParams: {
              [mockFacet.parameter.toLowerCase()]: [mockFacet.values[0].value],
            },
          })
        );
        expect(routerService.navigate).toHaveBeenCalled();
      });
    });

    describe('and pathId is existing for facet parameter', () => {
      beforeEach(() => {
        routerService.getPathId = vi.fn().mockReturnValue('test');
        callListener({
          name: mockFacet.name,
          value: mockFacet.values[0],
        });
      });

      it('should pass the correct params to the getUrl method', () => {
        expect(routerService.getUrl).toHaveBeenCalledWith(
          `/${mockFacet.parameter}/${mockFacet.values[0].value}`,
          expect.objectContaining({
            queryParams: undefined,
          })
        );
        expect(routerService.navigate).toHaveBeenCalled();
      });
    });

    describe('and facet`s name is not correct', () => {
      beforeEach(() => {
        callListener({
          name: 'test',
          value: mockFacet.values[0],
        });
      });

      it('should skip navigation', () => {
        expect(routerService.getUrl).not.toHaveBeenCalled();
      });
    });

    describe('and there is no value', () => {
      beforeEach(() => {
        callListener({
          name: mockFacet.name,
        });
      });

      it('should build the url with empty params', () => {
        expect(routerService.getUrl).toHaveBeenCalledWith(
          '',
          expect.objectContaining({
            queryParams: {
              [mockFacet.parameter.toLowerCase()]: [],
            },
          })
        );
      });
    });

    describe('and facet is multi-valued', () => {
      const value = 'test';

      beforeEach(async () => {
        listService.get = vi.fn().mockReturnValue(of([mockMultiValuedFacet]));
        element = await fixture(
          html`<oryx-search-facet-navigation></oryx-search-facet-navigation>`
        );
        callListener({
          name: mockMultiValuedFacet.name,
          value: { selected: true, value },
        });
      });

      it('should pass applied value to the parameters', () => {
        expect(routerService.getUrl).toHaveBeenCalledWith(
          '',
          expect.objectContaining({
            queryParams: {
              [mockMultiValuedFacet.parameter.toLowerCase()]: [value],
            },
          })
        );
      });

      describe('and facet has selected values', () => {
        const selectedValues = ['selected1', 'selected2'];

        beforeEach(async () => {
          listService.get = vi.fn().mockReturnValue(
            of([
              {
                ...mockMultiValuedFacet,
                selectedValues,
              },
            ])
          );
          element = await fixture(
            html`<oryx-search-facet-navigation></oryx-search-facet-navigation>`
          );
          callListener({
            name: mockMultiValuedFacet.name,
            value: { selected: true, value },
          });
        });

        it('should pass merged selected values to the params', () => {
          expect(routerService.getUrl).toHaveBeenCalledWith(
            '',
            expect.objectContaining({
              queryParams: {
                [mockMultiValuedFacet.parameter.toLowerCase()]: [
                  ...selectedValues,
                  value,
                ],
              },
            })
          );
        });

        describe('and there is no selected values', () => {
          beforeEach(async () => {
            element = await fixture(
              html`<oryx-search-facet-navigation></oryx-search-facet-navigation>`
            );
            callListener({
              name: mockMultiValuedFacet.name,
              value: { selected: false, value: selectedValues[0] },
            });
          });

          it('should pass filtered values to the url params', () => {
            expect(routerService.getUrl).toHaveBeenCalledWith(
              '',
              expect.objectContaining({
                queryParams: {
                  [mockMultiValuedFacet.parameter.toLowerCase()]: [
                    selectedValues[1],
                  ],
                },
              })
            );
          });
        });
      });
    });

    describe('and facet is range', () => {
      beforeEach(async () => {
        listService.get = vi.fn().mockReturnValue(of([mockRangeFacet]));
        element = await fixture(
          html`<oryx-search-facet-navigation></oryx-search-facet-navigation>`
        );
      });

      describe('and selected values are provided', () => {
        const selected = { min: 10, max: 20 };

        beforeEach(async () => {
          callListener({
            name: mockRangeFacet.name,
            value: { selected } as SelectRangeFacetValue,
          });
        });

        it('should pass min and max values to the parameters', () => {
          expect(routerService.getUrl).toHaveBeenCalledWith(
            '',
            expect.objectContaining({
              queryParams: {
                mock1: selected.min,
                mock2: selected.max,
              },
            })
          );
        });
      });

      describe('and selected values are equal to facet`s min and max', () => {
        const selected = { min: 0, max: 100 };

        beforeEach(async () => {
          callListener({
            name: mockRangeFacet.name,
            value: { selected } as SelectRangeFacetValue,
          });
        });

        it('should pass empty strings to the parameters', () => {
          expect(routerService.getUrl).toHaveBeenCalledWith(
            '',
            expect.objectContaining({
              queryParams: {
                mock1: '',
                mock2: '',
              },
            })
          );
        });
      });

      describe('and there are no selected values', () => {
        beforeEach(async () => {
          callListener({
            name: mockRangeFacet.name,
          });
        });

        it('should pass empty strings to the parameters', () => {
          expect(routerService.getUrl).toHaveBeenCalledWith(
            '',
            expect.objectContaining({
              queryParams: {
                mock1: '',
                mock2: '',
              },
            })
          );
        });
      });
    });
  });
});
