import { fixture, html } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { generateFacet } from '@spryker-oryx/product/mocks';
import { SearchFacetComponent } from '@spryker-oryx/search/facet';
import { mockFacetColors } from '@spryker-oryx/search/mocks';
import { useComponent } from '@spryker-oryx/utilities';
import { of } from 'rxjs';
import { FacetListService } from '../src/services';
import { FacetColorsMapping } from './facet-color-colors.mapping';
import { SearchColorFacetComponent } from './facet-color.component';
import { searchColorFacetComponent } from './facet-color.def';

const mockRenderLimit = Object.keys(mockFacetColors).length;
const mockFacet = generateFacet('Color', 'color', mockRenderLimit);

class MockFacetListService implements Partial<FacetListService> {
  getFacet = vi.fn().mockReturnValue(of(mockFacet));
}

describe('FacetColorComponent', () => {
  let element: SearchColorFacetComponent;

  beforeAll(async () => {
    await useComponent(searchColorFacetComponent);
  });

  beforeEach(async () => {
    createInjector({
      providers: [
        {
          provide: FacetListService,
          useClass: MockFacetListService,
        },
        {
          provide: FacetColorsMapping,
          useValue: mockFacetColors,
        },
      ],
    });

    element = await fixture(
      html`<oryx-search-color-facet
        name="Color"
        .renderLimit=${mockRenderLimit}
      ></oryx-search-color-facet>`
    );
  });

  afterEach(() => {
    destroyInjector();
  });

  it('should extend SearchFacetComponent', () => {
    expect(element).toBeInstanceOf(SearchFacetComponent);
  });

  it('should override renderValueControlLabel', () => {
    expect(element.renderRoot.querySelectorAll('oryx-swatch').length).toBe(
      mockRenderLimit
    );
  });

  it('should provide mapped color for the oryx-swatch', () => {
    const swatches = element.renderRoot.querySelectorAll(
      'oryx-swatch'
    ) as NodeListOf<Element & { color: string }>;
    const colorValues = Object.values(mockFacetColors);

    swatches.forEach((swatch) => expect(colorValues).toContain(swatch.color));
  });
});
