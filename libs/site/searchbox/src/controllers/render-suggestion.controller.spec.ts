import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { Product, ProductPrice } from '@spryker-oryx/product';
import { Suggestion, SuggestionResource } from '@spryker-oryx/site';
import '@spryker-oryx/testing';
import { html, LitElement, TemplateResult } from 'lit';
import { when } from 'lit-html/directives/when.js';
import { customElement, property } from 'lit/decorators.js';
import { MOCK_SUGGESTION_PROVIDERS } from '../../../src/mocks';
import { RenderSuggestionController } from './render-suggestion.controller';

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
  images: [
    {
      externalUrlLarge: 'test',
      externalUrlSmall: 'test',
    },
  ],
};

const notFoundSuggestion: Suggestion = {
  completion: [],
  categories: [],
  cmsPages: [],
  products: [],
};

const linksOnly: Suggestion = {
  completion: [resource.url],
  categories: [resource],
  cmsPages: [resource],
  products: [],
};

const completionOnly: Suggestion = {
  completion: [resource.url],
  categories: [],
  cmsPages: [],
  products: [],
};

const productsOnly: Suggestion = {
  completion: [],
  categories: [],
  cmsPages: [],
  products: [product],
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

  @property({ type: Object }) suggestion: Suggestion = notFoundSuggestion;

  render(): TemplateResult {
    return html`
      ${when(
        this.controller.isNothingFound(this.suggestion),
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
      providers: [...MOCK_SUGGESTION_PROVIDERS],
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
    describe('and there are links only', () => {
      beforeAll(async () => {
        element = await fixture(html`
          <fake-container .suggestion=${linksOnly}></fake-container>
        `);
      });

      it('should render only one section', () => {
        const sections = element.renderRoot.querySelectorAll('section');
        expect(sections.length).toBe(1);
      });

      it('should render the whole list of links', () => {
        const links = element.renderRoot.querySelectorAll('section > ul');
        expect(links.length).toBe(3);
      });
    });

    describe('and there is completion only', () => {
      beforeAll(async () => {
        element = await fixture(html`
          <fake-container .suggestion=${completionOnly}></fake-container>
        `);
      });

      it('should render completion links only', () => {
        const sections = element.renderRoot.querySelectorAll('section > ul');
        expect(sections.length).toBe(1);
      });
    });

    describe('and there are products only', () => {
      beforeAll(async () => {
        element = await fixture(html`
          <fake-container .suggestion=${productsOnly}></fake-container>
        `);
      });

      it('should render only one section', () => {
        const sections = element.renderRoot.querySelectorAll('section');
        expect(sections.length).toBe(1);
      });

      it('should render a product link', () => {
        const product = element.renderRoot.querySelector('.product');
        expect(product).not.toBeNull();
      });
    });
  });
});
