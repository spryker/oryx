import { fixture } from '@open-wc/testing-helpers';
import { ContentLinkComponent } from '@spryker-oryx/content/link';
import { componentDef } from '@spryker-oryx/core';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector, resolve } from '@spryker-oryx/di';
import { Product, ProductPrice } from '@spryker-oryx/product';
import { SearchBoxProperties } from '@spryker-oryx/search/box';
import { mockSearchProviders } from '@spryker-oryx/search/mocks';
import { SemanticLinkType } from '@spryker-oryx/site';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { Suggestion, SuggestionResource } from '../../models';
import { DefaultSuggestionRenderer } from './default-suggestion.renderer';

const resource: SuggestionResource = {
  name: 'test',
  url: 'test',
};

const price: ProductPrice = {
  value: 10,
  currency: 'EUR',
  isNet: false,
};

const product: Product = {
  sku: '',
  name: '',
  price: {
    defaultPrice: price,
    originalPrice: price,
  },
  mediaSet: [
    {
      media: [
        {
          xs: 'test',
          lg: 'test',
        },
      ],
    },
  ],
};

const notFoundSuggestion: Suggestion = {
  completion: [],
  categories: [],
  cmsPages: [],
  products: [],
};

const suggestion: Suggestion = {
  completion: [resource.url ?? ''],
  categories: [resource],
  cmsPages: [resource],
  products: [product],
};

const completionOnly: Suggestion = {
  completion: [resource.url ?? ''],
  categories: [],
  cmsPages: [],
  products: [],
};

const categoriesOnly: Suggestion = {
  completion: [],
  categories: [
    { name: 'test1', url: '0' },
    { name: 'test2', url: '1' },
    { name: 'test3', url: '2' },
  ],
  cmsPages: [],
  products: [],
};

class FakeContainer extends LitElement implements SearchBoxProperties {
  query = '';

  protected isNothingFound(suggestion: Suggestion): boolean {
    return (
      !suggestion.products.length &&
      !suggestion.categories.length &&
      !suggestion.cmsPages.length &&
      !suggestion.completion.length
    );
  }
  @property({ type: Object }) suggestion: Suggestion = notFoundSuggestion;

  render(): TemplateResult {
    return html`
      ${when(
        !this.isNothingFound(this.suggestion),
        () =>
          html`
            ${resolve(DefaultSuggestionRenderer).render(
              this.suggestion,
              this.query
            )}
          `
      )}
    `;
  }
}

describe('DefaultSuggestionRenderer', () => {
  let element: FakeContainer;

  beforeAll(async () => {
    await useComponent([
      componentDef({ name: 'fake-container', impl: FakeContainer }),
    ]);
  });

  beforeEach(async () => {
    createInjector({
      providers: [
        ...mockSearchProviders,
        {
          provide: DefaultSuggestionRenderer,
          useClass: DefaultSuggestionRenderer,
        },
      ],
    });
  });

  afterEach(() => {
    destroyInjector();
  });

  describe('when suggestion results are provided', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <fake-container .suggestion=${suggestion}></fake-container>
      `);
    });

    it('should render sections', () => {
      const sections = element.renderRoot.querySelectorAll('section');
      expect(sections.length).toBe(2);
    });

    it('should render the whole list of links', () => {
      const links = element.renderRoot.querySelectorAll(
        'section:nth-child(1) > ul'
      );
      expect(links.length).toBe(3);
    });

    describe('and there is completion only', () => {
      beforeEach(async () => {
        element = await fixture(html`
          <fake-container .suggestion=${completionOnly}></fake-container>
        `);
      });

      it('should render completion links only', () => {
        const sections = element.renderRoot.querySelectorAll(
          'section:nth-child(1) > ul'
        );
        expect(sections.length).toBe(1);
      });
    });
  });
  describe('when suggestion provided category list', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <fake-container .suggestion=${categoriesOnly}></fake-container>
      `);
    });

    it('should render list of links', () => {
      const links = element.renderRoot.querySelectorAll(
        'section:nth-child(1) > ul oryx-content-link'
      );
      expect(links.length).toBe(3);
    });

    it('should render list of links with correct url', () => {
      const links = element.renderRoot.querySelectorAll(
        'section:nth-child(1) > ul oryx-content-link'
      );
      Array.from(links).forEach((link) => {
        expect((link as ContentLinkComponent).options?.type).toBe(
          SemanticLinkType.Category
        );
      });
    });
  });

  describe('when host has query', () => {
    const query = 'test';

    beforeEach(async () => {
      element = await fixture(html`
        <fake-container
          .query=${query}
          .suggestion=${suggestion}
        ></fake-container>
      `);
    });

    it('should pass query to the view all link params', () => {
      const viewAllLink =
        element.renderRoot.querySelector<ContentLinkComponent>(
          'oryx-button > oryx-content-link'
        );
      expect(viewAllLink?.options?.params?.q).toBe(query);
    });
  });

  describe('when view all button is clicked', () => {
    const callback = vi.fn();

    beforeEach(async () => {
      element = await fixture(html`
        <fake-container
          .suggestion=${suggestion}
          @oryx.close=${callback}
        ></fake-container>
      `);

      element.renderRoot
        .querySelector('oryx-button')
        ?.dispatchEvent(new MouseEvent('click'));
    });

    it('should dispatch oryx.close event', () => {
      expect(callback).toHaveBeenCalled();
    });
  });
});
