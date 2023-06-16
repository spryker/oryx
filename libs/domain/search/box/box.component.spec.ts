import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { ExperienceService } from '@spryker-oryx/experience';
import { I18nService } from '@spryker-oryx/i18n';
import { RouterService } from '@spryker-oryx/router';
import { mockSearchProviders } from '@spryker-oryx/search/mocks';
import { SemanticLinkService, SemanticLinkType } from '@spryker-oryx/site';
import { typeheadComponent } from '@spryker-oryx/ui';
import { html } from 'lit';
import { of } from 'rxjs';
import { SearchBoxComponent } from './box.component';
import { searchBoxComponent } from './box.def';

class MockRouterService implements Partial<RouterService> {
  navigate = vi.fn();
}

class MockSemanticLinkService implements Partial<SemanticLinkService> {
  get = vi.fn().mockReturnValue(of(''));
}

class MockEBService implements Partial<ExperienceService> {
  getOptions = vi.fn().mockReturnValue(of({}));
}

class MockI18NService implements Partial<I18nService> {
  translate = vi.fn().mockReturnValue(of('search'));
}

const query = 'pro';

describe('SearchBoxComponent', () => {
  let element: SearchBoxComponent;
  let linkService: MockSemanticLinkService;
  let routerService: MockRouterService;

  const hasControls = (): boolean => {
    return (
      element.renderRoot.querySelectorAll(
        `oryx-button[slot="suffix"], oryx-icon-button[slot="suffix"]`
      ).length === 2
    );
  };

  const update = async (): Promise<void> => {
    element.requestUpdate();
    await element.updateComplete;
  };

  const getInput = (): HTMLInputElement => {
    return element.renderRoot.querySelector('input') as HTMLInputElement;
  };

  const simulateTyping = async (query: string): Promise<void> => {
    const input = getInput();

    input.value = query;
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await update();
  };

  const hasResults = async (expectation = true): Promise<void> => {
    await update();

    const container = element.renderRoot.querySelector('[slot="option"]');

    if (expectation) {
      expect(container).not.toBeNull();
      return;
    }

    expect(container).toBeNull();
  };

  beforeAll(async () => {
    await useComponent([searchBoxComponent, typeheadComponent]);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: ExperienceService,
          useClass: MockEBService,
        },
        {
          provide: RouterService,
          useClass: MockRouterService,
        },
        {
          provide: SemanticLinkService,
          useClass: MockSemanticLinkService,
        },
        {
          provide: I18nService,
          useClass: MockI18NService,
        },
        ...mockSearchProviders,
      ],
    });
    linkService = testInjector.inject(
      SemanticLinkService
    ) as MockSemanticLinkService;
    routerService = testInjector.inject(
      RouterService
    ) as unknown as MockRouterService;
    element = await fixture(html`<oryx-search-box></oryx-search-box>`);
  });

  afterEach(() => {
    destroyInjector();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe('when query is not provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-search-box query=""></oryx-search-box>`
      );

      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.clearAllTimers();
    });

    it('should not render result`s container', async () => {
      await hasResults(false);
    });

    it('should not render the controls', () => {
      expect(hasControls()).toBe(false);
    });
  });

  describe('when query is containing spaces only', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-search-box query="     "></oryx-search-box>`
      );

      vi.useFakeTimers();

      //debounce the typeahead event dispatching
      vi.advanceTimersByTime(301);
    });

    afterEach(() => {
      vi.clearAllTimers();
    });

    it('should not render result`s container', async () => {
      await hasResults(false);
    });
  });

  describe('when query is to short', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-search-box query="p"></oryx-search-box>`
      );

      vi.useFakeTimers();

      //debounce the typeahead event dispatching
      vi.advanceTimersByTime(301);
    });

    afterEach(() => {
      vi.clearAllTimers();
    });

    it('should not render result`s container', async () => {
      await hasResults(false);
    });

    it('should render the controls', () => {
      expect(hasControls()).toBe(true);
    });
  });

  describe('when query is provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-search-box query="prod"></oryx-search-box>`
      );

      vi.useFakeTimers();

      //debounce the typeahead event dispatching
      vi.advanceTimersByTime(301);
    });

    afterEach(() => {
      vi.clearAllTimers();
    });

    it('should render result`s container with results', async () => {
      await hasResults();
    });

    it('should render the controls', () => {
      expect(hasControls()).toBe(true);
    });

    it('should set `stretched` attr', async () => {
      expect(element.hasAttribute('stretched')).toBe(true);
    });
  });

  describe('when not found', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-search-box query="abracadabra"></oryx-search-box>`
      );

      vi.useFakeTimers();

      //debounce the typeahead event dispatching
      vi.advanceTimersByTime(301);

      await update();
    });

    afterEach(() => {
      vi.clearAllTimers();
    });

    it('should render `not found` container', async () => {
      expect(element.renderRoot.querySelector('[slot="empty"]')).not.toBeNull();
    });
  });

  describe('when typing a query string', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-search-box></oryx-search-box>`);

      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.clearAllTimers();
    });

    it('should update the query param', async () => {
      await simulateTyping(query);

      expect(element.query).toBe(query);
    });

    it('should receive the results', async () => {
      await hasResults(false);

      await simulateTyping(query);
      //debounce the typeahead event dispatching
      vi.advanceTimersByTime(301);

      await hasResults();
    });
  });

  describe('when container with results is scrolled', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-search-box></oryx-search-box>`);

      vi.useFakeTimers();

      await simulateTyping(query);
      //debounce the typeahead event dispatching
      vi.advanceTimersByTime(301);

      await update();

      const scrollContainer = element.renderRoot.querySelector(
        '[slot="option"] > *'
      ) as HTMLDivElement;

      scrollContainer.scrollTop = 10;
      scrollContainer?.dispatchEvent(new CustomEvent('scroll'));

      //debounce onscroll event's callback dispatching
      vi.advanceTimersByTime(21);
    });

    afterEach(() => {
      vi.clearAllTimers();
    });

    it('should set scrolling-top attribute', () => {
      expect(element.hasAttribute('scrollable-top')).toBe(true);
    });
  });

  describe('when oryx.clear event dispatched', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-search-box query="123"></oryx-search-box>`
      );
    });

    it('should clear input value', () => {
      const input = element.renderRoot.querySelector(
        'input'
      ) as HTMLInputElement;
      element.dispatchEvent(new CustomEvent('oryx.clear', { bubbles: true }));

      expect(input.value).toBe('');
    });
  });

  describe('when oryx.close event is dispatched', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-search-box query="123"></oryx-search-box>`
      );
    });

    it('should close the dropdown', () => {
      const typeahead = element.renderRoot.querySelector(
        'oryx-typeahead'
      ) as HTMLElement;

      typeahead.setAttribute('open', '');

      element.dispatchEvent(new CustomEvent('oryx.close'));

      expect(typeahead.hasAttribute('open')).toBe(false);
    });
  });

  describe('suggestion is provided partially', () => {
    describe('and there are links only', () => {
      beforeEach(async () => {
        element = await fixture(html`
          <oryx-search-box
            query="pro"
            .options=${{
              productsCount: 0,
            }}
          ></oryx-search-box>
        `);

        vi.useFakeTimers();

        //debounce the typeahead event dispatching
        vi.advanceTimersByTime(301);
      });

      afterEach(() => {
        vi.clearAllTimers();
      });

      it('should render only one section', () => {
        const sections = element.renderRoot.querySelectorAll(
          '[slot="option"] section'
        );
        expect(sections?.length).toBe(1);
      });
    });

    describe('and there are products only', () => {
      beforeEach(async () => {
        element = await fixture(html`
          <oryx-search-box
            query="pro"
            .options=${{
              categoriesCount: 0,
              completionsCount: 0,
              cmsCount: 0,
            }}
          ></oryx-search-box>
        `);

        vi.useFakeTimers();

        //debounce the typeahead event dispatching
        vi.advanceTimersByTime(301);
      });

      afterEach(() => {
        vi.clearAllTimers();
      });

      it('should render only one section', () => {
        const sections = element.renderRoot.querySelectorAll(
          '[slot="option"] section'
        );
        expect(sections?.length).toBe(1);
      });
    });
  });

  describe('when search is submitted', () => {
    describe('and query is empty string', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-search-box></oryx-search-box>`);
        element.renderRoot
          .querySelector('oryx-typeahead')
          ?.toggleAttribute('open', true);
        element.renderRoot
          .querySelector('form')
          ?.dispatchEvent(new Event('submit'));
      });

      it('should get the link from service without params', () => {
        expect(linkService.get).toHaveBeenCalledWith({
          type: SemanticLinkType.ProductList,
        });
      });

      it('should navigate by link', () => {
        expect(routerService.navigate).toHaveBeenCalled();
      });

      it('should close typeahead', () => {
        expect(element).toContainElement('oryx-typeahead:not([open])');
      });
    });

    describe('and query is provided', () => {
      const q = 'test';
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-search-box .query=${q}></oryx-search-box>`
        );
        element.renderRoot
          .querySelector('form')
          ?.dispatchEvent(new Event('submit'));
      });

      it('should get the link from service with params', () => {
        expect(linkService.get).toHaveBeenCalledWith({
          type: SemanticLinkType.ProductList,
          params: { q },
        });
      });
    });
  });
});
