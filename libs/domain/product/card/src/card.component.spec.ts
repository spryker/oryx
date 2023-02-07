import { fixture } from '@open-wc/testing-helpers';
import { contentLinkComponent } from '@spryker-oryx/content';
import * as core from '@spryker-oryx/core';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { ProductContext } from '@spryker-oryx/product';
import { mockProductProviders } from '@spryker-oryx/product/mocks';
import { siteProviders } from '@spryker-oryx/site';
import { html } from 'lit';
import { of } from 'rxjs';
import { SpyInstance } from 'vitest';
import { ProductCardComponent } from './card.component';
import { productCardComponent } from './card.def';
import { ProductCardOptions } from './card.model';

const mockContext = {
  get: vi.fn().mockReturnValue(of('1')),
  provide: vi.fn(),
};
vi.spyOn(core, 'ContextController') as SpyInstance;
(core.ContextController as unknown as SpyInstance).mockReturnValue(mockContext);

describe('ProductCardComponent', () => {
  let element: ProductCardComponent;

  beforeAll(async () => {
    await useComponent([productCardComponent, contentLinkComponent]);
  });

  beforeEach(async () => {
    createInjector({
      providers: [...mockProductProviders, ...siteProviders],
    });

    element = await fixture(
      html`<product-card sku="1" uid="1"></product-card>`
    );
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('should render inner components', () => {
    expect(element).toContainElement('content-link');
    expect(element).toContainElement('oryx-product-media');
    expect(element).toContainElement('oryx-product-title');
    expect(element).toContainElement('oryx-product-price');
    expect(element).toContainElement('oryx-product-average-rating');
    expect(element).toContainElement('oryx-cart-add');
    expect(element).toContainElement('oryx-product-labels');

    //TODO: replace by favorites component
    expect(element).toContainElement('oryx-icon-button');
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

  describe('when enableTitle = false', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <product-card uid="1" .options=${{ enableTitle: false }}></product-card>
      `);
    });

    it('should not render product-title', () => {
      expect(element).not.toContainElement('product-title');
    });
  });

  // TODO: find the reason why `element.style.getPropertyValue` is not available
  describe('title truncation', () => {
    it('should set default (1) --oryx-product-title-max-lines when option is not provided', () => {
      expect(
        Number(
          (element.style as Record<string, any>)[
            '--oryx-product-title-max-lines'
          ]
        )
      ).toBe(1);
    });

    describe('when option is provided', () => {
      const titleLineClamp = 3;
      beforeEach(async () => {
        element = await fixture(html`
          <product-card
            sku="1"
            .options=${{ titleLineClamp } as ProductCardOptions}
          ></product-card>
        `);
      });

      it('should set the --oryx-product-title-max-lines css property', async () => {
        expect(
          Number(
            (element.style as Record<string, any>)[
              '--oryx-product-title-max-lines'
            ]
          )
        ).toBe(titleLineClamp);
      });
    });
  });

  describe('when enableMedia = false', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <product-card uid="1" .options=${{ enableMedia: false }}></product-card>
      `);
    });

    it('should not render the product media', () => {
      expect(element).not.toContainElement('oryx-product-media');
    });
  });

  describe('when enablePrice = false', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <product-card uid="1" .options=${{ enablePrice: false }}></product-card>
      `);
    });

    it('should not render product-price', () => {
      expect(element).not.toContainElement('product-price');
    });
  });

  describe('when enableRating = false', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <product-card
          uid="1"
          .options=${{ enableRating: false }}
        ></product-card>
      `);
    });

    it('should not render oryx-product-average-rating', () => {
      expect(element).not.toContainElement('oryx-product-average-rating');
    });
  });

  describe('when enableLabels = false', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <product-card
          uid="1"
          .options=${{ enableLabels: false }}
        ></product-card>
      `);
    });

    it('should not render product-labels', () => {
      expect(element).not.toContainElement('oryx-product-labels');
    });
  });

  describe('when enableWishlist = false', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <product-card
          uid="1"
          .options=${{ enableWishlist: false }}
        ></product-card>
      `);
    });

    it('should not render the wishlist button', () => {
      expect(element).not.toContainElement('oryx-icon-button');
    });
  });

  describe('when enableAddToCart = false', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <product-card
          uid="1"
          .options=${{ enableAddToCart: false }}
        ></product-card>
      `);
    });

    it('should not render the cart-add element', () => {
      expect(element).not.toContainElement('oryx-cart-add');
    });
  });

  describe('when no product', () => {
    beforeEach(async () => {
      destroyInjector();

      const mockContext = {
        get: vi.fn().mockReturnValue(of('test')),
        provide: vi.fn(),
      };
      vi.spyOn(core, 'ContextController') as SpyInstance;
      (core.ContextController as unknown as SpyInstance).mockReturnValue(
        mockContext
      );

      createInjector({
        providers: [...mockProductProviders, ...siteProviders],
      });

      element = await fixture(html` <product-card></product-card> `);
    });

    it('should not render the content', () => {
      expect(element).not.toContainElement('content-link');
    });
  });
});
