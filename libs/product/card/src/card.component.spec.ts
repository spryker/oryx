import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { ProductContext } from '@spryker-oryx/product';
import '@spryker-oryx/testing';
import { html } from 'lit';
import { of } from 'rxjs';
import { MOCK_PRODUCT_PROVIDERS } from '../../src/mocks';
import '../index';
import { ProductCardComponent } from './card.component';

const mockContextProvide = vi.fn();

vi.mock('@spryker-oryx/core', async () => {
  const core = (await vi.importActual('@spryker-oryx/core')) as Array<unknown>;

  return {
    ...core,
    ContextController: class {
      get = vi.fn().mockReturnValue(of('mockSku'));
      provide = mockContextProvide;
    },
  };
});

describe('ProductCardComponent', () => {
  let element: ProductCardComponent;

  beforeEach(async () => {
    createInjector({
      providers: [...MOCK_PRODUCT_PROVIDERS],
    });
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('is defined', async () => {
    element = await fixture(html`<product-card uid="uid"></product-card>`);

    expect(element).toBeInstanceOf(ProductCardComponent);
  });

  it('passes the a11y audit', async () => {
    element = await fixture(html`<product-card uid="1"></product-card>`);

    await expect(element).shadowDom.to.be.accessible();
  });

  describe('should render', () => {
    beforeEach(async () => {
      element = await fixture(html`<product-card uid="1"></product-card>`);
    });

    it('Child elements wrapped into a', () => {
      const children = Array.from(element.shadowRoot?.children || []).filter(
        (item) => item.tagName.toLowerCase() !== 'style'
      );

      expect(children.length).toBe(1);
      expect(children[0]).toBeInstanceOf(HTMLAnchorElement);
    });

    it('Image component', () => {
      const component = element.shadowRoot?.querySelector('product-image');

      expect(component).not.toBeNull();
    });

    it('Title component', () => {
      const component = element.shadowRoot?.querySelector('product-title');

      expect(component).not.toBeNull();
    });

    it('Price component', () => {
      const component = element.shadowRoot?.querySelector('product-price');

      expect(component).not.toBeNull();
    });

    it('Average rating component', () => {
      const component = element.shadowRoot?.querySelector(
        'product-average-rating'
      );

      expect(component).not.toBeNull();
    });

    it('Add to cart component', () => {
      const component = element.shadowRoot?.querySelector('add-to-cart');

      expect(component).not.toBeNull();
    });
  });

  describe('should fill context with', () => {
    const propSku = 'propSku';
    const optionsSku = 'optionSku';

    it('sku from the property', async () => {
      await fixture(html`<product-card sku="${propSku}"></product-card>`);

      expect(mockContextProvide).toHaveBeenCalledWith(
        ProductContext.SKU,
        propSku
      );
    });

    it('sku from the options', async () => {
      await fixture(
        html`<product-card .options="${{ sku: optionsSku }}"></product-card>`
      );

      expect(mockContextProvide).toHaveBeenCalledWith(
        ProductContext.SKU,
        optionsSku
      );
    });

    it('sku from options if provided both', async () => {
      await fixture(
        html`<product-card
          sku="${propSku}"
          .options="${{ sku: optionsSku }}"
        ></product-card>`
      );

      expect(mockContextProvide).toHaveBeenCalledWith(
        ProductContext.SKU,
        optionsSku
      );
    });
  });
});
