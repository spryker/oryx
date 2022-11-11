import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { html } from 'lit';
import { FacetListService } from '../../src/services/facet-list.service';
import { SearchFacetNavigationComponent } from './facet-navigation.component';
import { facetsComponent } from './facet-navigation.def';

class MockFacetListService implements Partial<FacetListService> {
  get = vi.fn();
}

describe('SearchFacetNavigationComponent', () => {
  let element: SearchFacetNavigationComponent;

  beforeAll(async () => {
    await useComponent(facetsComponent);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: FacetListService,
          useClass: MockFacetListService,
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
});
