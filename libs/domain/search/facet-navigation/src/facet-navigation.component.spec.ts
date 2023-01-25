import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { Facet } from '@spryker-oryx/product';
import { RouterService } from '@spryker-oryx/router';
import {
  DefaultFacetComponentRegistryService,
  FacetComponentRegistryService,
  FacetListService,
  FacetMappingOptions,
  FacetParams,
  FacetValueRenderer,
} from '@spryker-oryx/search';
import { FacetSelect } from '@spryker-oryx/search/facet';
import { html } from 'lit';
import { of } from 'rxjs';
import { SearchFacetNavigationComponent } from './facet-navigation.component';
import { facetsComponent } from './facet-navigation.def';

const mockFacetList = [
  {
    name: 'Categories',
    parameter: 'category',
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
  },
  {
    name: 'Color',
    parameter: 'color',
    count: null,
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
      {
        value: 'Blue',
        selected: false,
        count: 2,
      },
      {
        value: 'Brown',
        selected: false,
        count: 1,
      },
      {
        value: 'Purple',
        selected: false,
        count: 1,
      },
      {
        value: 'White',
        selected: false,
        count: 1,
      },
    ],
  },
  {
    name: 'Mock',
    parameter: 'mock',
    count: null,
    values: [
      {
        value: 'Black',
        selected: false,
        count: 11,
      },
    ],
  },
  {
    name: 'Mock1',
    parameter: 'mock1',
    count: null,
    values: [
      {
        value: 'Black',
        selected: false,
        count: 11,
      },
    ],
  },
  {
    name: 'Mock2',
    parameter: 'mock2',
    count: null,
    values: [
      {
        value: 'Black',
        selected: false,
        count: 11,
      },
    ],
  },
  {
    name: 'Mock3',
    parameter: 'mock3',
    count: null,
    values: [
      {
        value: 'Black',
        selected: false,
        count: 11,
      },
    ],
  },
];

class MockFacetListService implements Partial<FacetListService> {
  get = vi.fn().mockReturnValue(of(mockFacetList));
}

class MockRouterService implements Partial<RouterService> {
  currentQuery = vi.fn().mockReturnValue(of({}));
  currentRoute = vi.fn().mockReturnValue(of({}));
  getUrl = vi.fn().mockReturnValue(of(''));
}

describe('SearchFacetNavigationComponent', () => {
  let element: SearchFacetNavigationComponent;

  beforeAll(async () => {
    await useComponent(facetsComponent);
  });

  beforeEach(async () => {
    createInjector({
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
          useClass: DefaultFacetComponentRegistryService,
        },
        {
          provide: FacetValueRenderer,
          useValue: {
            [`${FacetParams.Default}`]: {
              template: (
                facet: Facet,
                options: FacetMappingOptions,
                selectListener: (e: CustomEvent<FacetSelect>) => void
              ) => {
                return html`
                  <oryx-search-facet
                    @oryx.select=${selectListener}
                    .name=${facet.name}
                    .renderLimit=${options.renderLimit}
                    .open=${options.open}
                    .multi=${facet.multiValued}
                  >
                  </oryx-search-facet>
                `;
              },
            },
          },
        },
      ],
    });

    element = await fixture(
      html`<search-facet-navigation></search-facet-navigation>`
    );
  });

  afterEach(() => {
    destroyInjector();
  });

  it('is defined', () => {
    expect(element).toBeInstanceOf(SearchFacetNavigationComponent);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('should render oryx-facet element for every mock facet', () => {
    expect(
      element.renderRoot.querySelectorAll('oryx-search-facet').length
    ).toBe(6);
  });

  describe('when "valueRenderLimit" is provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<search-facet-navigation
          .options=${{ valueRenderLimit: 3 }}
        ></search-facet-navigation>`
      );
    });

    it('should render the specified amount in the option', () => {
      const facet = <Element & { renderLimit: number }>(
        element.renderRoot.querySelectorAll('oryx-search-facet')[1]
      );

      expect(facet.renderLimit).toBe(3);
    });
  });

  describe('when "expandedItemsCount" is provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<search-facet-navigation
          .options=${{ expandedItemsCount: 1 }}
        ></search-facet-navigation>`
      );
    });

    it('should expand collapsible items with specified amount in the option', () => {
      expect(
        (<Element & { open: boolean }>(
          element.renderRoot.querySelectorAll('oryx-search-facet')[0]
        )).open
      ).toBe(true);
      expect(
        (<Element & { open: boolean }>(
          element.renderRoot.querySelectorAll('oryx-search-facet')[1]
        )).open
      ).not.toBe(true);
    });
  });

  describe('when "expandedItemsCount" is provided as 0', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<search-facet-navigation
          .options=${{ expandedItemsCount: 0 }}
        ></search-facet-navigation>`
      );
    });

    it('all collapsible should be closed', () => {
      element.renderRoot.querySelectorAll('oryx-collapsible').forEach((c) => {
        expect(c.getAttribute('open')).toBeNull();
      });
    });
  });

  describe('when "valueRenderLimit" is not provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<search-facet-navigation></search-facet-navigation>`
      );
    });

    it('should render the default amount in the option', () => {
      element.renderRoot.querySelectorAll('oryx-collapsible').forEach((c) => {
        expect(c.shadowRoot?.querySelectorAll('li')).toBeLessThanOrEqual(5);
      });
    });
  });

  describe('when "expandedItemsCount" is not provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<search-facet-navigation .options=${{}}></search-facet-navigation>`
      );
    });

    it('should expand default amount of items', () => {
      element.renderRoot
        .querySelectorAll('oryx-collapsible')
        .forEach((c, index) => {
          if (index < 5) {
            expect(c.hasAttribute('open')).toBeTruthy();
          } else {
            expect(c.hasAttribute('open')).toBeFalsy();
          }
        });
    });
  });
});
