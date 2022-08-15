import { fixture } from '@open-wc/testing-helpers';
import { ContentLinkComponent } from '@spryker-oryx/content/link';
import * as core from '@spryker-oryx/core';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { ProductContext } from '@spryker-oryx/product';
import { SemanticLinkType } from '@spryker-oryx/site';
import '@spryker-oryx/testing';
import { html } from 'lit';
import { of } from 'rxjs';
import { SpyInstance } from 'vitest';
import { MockProductService, MOCK_PRODUCT_PROVIDERS } from '../../src/mocks';
import { productCardComponent } from '../index';
import { ProductCardComponent } from './card.component';

useComponent(productCardComponent);

const mockContext = {
  get: vi.fn().mockReturnValue(of('mockSku')),
  provide: vi.fn(),
};
vi.spyOn(core, 'ContextController') as SpyInstance;
(core.ContextController as unknown as SpyInstance).mockReturnValue(mockContext);

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

    it('Child elements wrapped into content-link with proper options', () => {
      const children = Array.from(element.shadowRoot?.children || []).filter(
        (item) => item.tagName.toLowerCase() !== 'style'
      );
      const component = element.shadowRoot?.querySelector(
        'content-link'
      ) as ContentLinkComponent;

      expect(children.length).toBe(1);
      expect(component).not.toBeNull();
      expect(component?.options?.id).toBe(
        MockProductService.mockProducts[0].sku
      );

      expect(component?.options?.type).toBe(SemanticLinkType.Product);
    });

    it('Images component', () => {
      const component = element.shadowRoot?.querySelector('product-images');

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

      expect(mockContext.provide).toHaveBeenCalledWith(
        ProductContext.SKU,
        propSku
      );
    });

    it('sku from the options', async () => {
      await fixture(
        html`<product-card .options="${{ sku: optionsSku }}"></product-card>`
      );

      expect(mockContext.provide).toHaveBeenCalledWith(
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

      expect(mockContext.provide).toHaveBeenCalledWith(
        ProductContext.SKU,
        optionsSku
      );
    });
  });
});
