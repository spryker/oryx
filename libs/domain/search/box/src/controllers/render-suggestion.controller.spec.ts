import { fixture } from '@open-wc/testing-helpers';
import { ContentLinkComponent } from '@spryker-oryx/content/link';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { Product, ProductPrice } from '@spryker-oryx/product';
import { Suggestion, SuggestionResource } from '@spryker-oryx/search';
import { mockSearchProviders } from '@spryker-oryx/search/mocks';
import { SemanticLinkType } from '@spryker-oryx/site';
import { html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { RenderSuggestionController } from './render-suggestion.controller';

const resource: SuggestionResource = {
  name: 'test',
  url: 'test',
};

const mockCategoryNames = [
  'category-name1',
  'category-name2',
  'category-name1232',
];

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
    { name: 'test1', url: `test/ua/${mockCategoryNames[0]}` },
    { name: 'test2', url: `test/ua/uk/${mockCategoryNames[1]}` },
    { name: 'test3', url: `test/ua/test/name/${mockCategoryNames[2]}` },
  ],
  cmsPages: [],
  products: [],
};

@customElement('fake-container')
class FakeContainer extends LitElement {
  protected options = {
    nothingFoundText: '',
    completionTitle: '',
    categoriesTitle: '',
    cmsTitle: '',
    productsTitle: '',
    viewAllProductsButtonTitle: '',
  };

  controller = new RenderSuggestionController();

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
        this.isNothingFound(this.suggestion),
        () => this.controller.renderNothingFound(this.options),
        () => html`
          ${this.controller.renderLinksSection(this.suggestion, this.options)}
          ${this.controller.renderProductsSection(
            this.suggestion,
            this.options
          )}
        `
      )}
    `;
  }
}

describe('RenderSuggestionController', () => {
  let element: FakeContainer;

  beforeEach(async () => {
    createInjector({
      providers: mockSearchProviders,
    });
  });

  afterEach(() => {
    destroyInjector();
  });

  describe('when suggestion results are empty', () => {
    beforeAll(async () => {
      element = await fixture(html` <fake-container></fake-container> `);
    });

    it('should render nothing found state', () => {
      const notFoundContainer =
        element.renderRoot.querySelector('[slot="empty"]');

      expect(notFoundContainer).not.toBeNull();
    });
  });

  describe('when suggestion results are provided', () => {
    beforeAll(async () => {
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
      beforeAll(async () => {
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
    beforeAll(async () => {
      element = await fixture(html`
        <fake-container .suggestion=${categoriesOnly}></fake-container>
      `);
    });

    it('should render list of links', () => {
      const links = element.renderRoot.querySelectorAll(
        'section:nth-child(1) > ul content-link'
      );
      expect(links.length).toBe(3);
    });

    it('should render list of links with correct url', () => {
      const links = element.renderRoot.querySelectorAll(
        'section:nth-child(1) > ul content-link'
      );
      Array.from(links).forEach((link, index) => {
        expect((link as ContentLinkComponent).options?.id).toBe(
          mockCategoryNames[index]
        );
        expect((link as ContentLinkComponent).options?.params?.q).toBe(
          mockCategoryNames[index]
        );
        expect((link as ContentLinkComponent).options?.type).toBe(
          SemanticLinkType.Category
        );
      });
    });
  });
});
