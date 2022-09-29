import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { Product, ProductPrice } from '@spryker-oryx/product';
import { Suggestion, SuggestionResource } from '@spryker-oryx/search';
import '@spryker-oryx/testing';
import { html, LitElement, TemplateResult } from 'lit';
import { when } from 'lit-html/directives/when.js';
import { customElement, property } from 'lit/decorators.js';
import { mockSuggestionProviders } from '../../../src/mocks';
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
      providers: [...mockSuggestionProviders],
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
});
