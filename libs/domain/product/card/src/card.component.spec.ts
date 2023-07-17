import { fixture } from '@open-wc/testing-helpers';
import { contentLinkComponent } from '@spryker-oryx/content';
import * as core from '@spryker-oryx/core';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { mockProductProviders } from '@spryker-oryx/product/mocks';
import { siteProviders } from '@spryker-oryx/site';
import { html } from 'lit';
import { of } from 'rxjs';
import { SpyInstance } from 'vitest';
import { ProductCardComponent } from './card.component';
import { productCardComponent } from './card.def';
import { RouterService, RouteType } from '@spryker-oryx/router';

const mockContext = {
  get: vi.fn().mockReturnValue(of('1')),
  provide: vi.fn(),
};
vi.spyOn(core, 'ContextController') as SpyInstance;
(core.ContextController as unknown as SpyInstance).mockReturnValue(mockContext);

const mockRouterService = {
  getRoutes: vi.fn().mockReturnValue(
    of([
      {
        path: '/product/:id',
        type: RouteType.Product,
      },
    ])
  ),
};

describe('ProductCardComponent', () => {
  let element: ProductCardComponent;

  beforeAll(async () => {
    await useComponent([productCardComponent, contentLinkComponent]);
  });

  beforeEach(async () => {
    createInjector({
      providers: [
        ...mockProductProviders,
        ...siteProviders,
        {
          provide: RouterService,
          useValue: mockRouterService,
        },
      ],
    });

    element = await fixture(
      html`<oryx-product-card sku="1" uid="1"></oryx-product-card>`
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
    expect(element).toContainElement('a oryx-product-media');
    expect(element).toContainElement('a oryx-product-title');
    expect(element).toContainElement('a oryx-product-price');
    expect(element).toContainElement('a oryx-product-average-rating');
    expect(element).toContainElement('a oryx-cart-add');
    expect(element).toContainElement('a oryx-product-labels');
  });

  describe('when enableTitle = false', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-product-card
          uid="1"
          .options=${{
            enableTitle: false,
          }}
        ></oryx-product-card>
      `);
    });

    it('should not render product-title', () => {
      expect(element).not.toContainElement('product-title');
    });
  });

  describe('when enableMedia = false', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-product-card
          uid="1"
          .options=${{
            enableMedia: false,
          }}
        ></oryx-product-card>
      `);
    });

    it('should not render the product media', () => {
      expect(element).not.toContainElement('oryx-product-media');
    });
  });

  describe('when enablePrice = false', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-product-card
          uid="1"
          .options=${{
            enablePrice: false,
          }}
        ></oryx-product-card>
      `);
    });

    it('should not render product-price', () => {
      expect(element).not.toContainElement('product-price');
    });
  });

  describe('when enableRating = false', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-product-card
          uid="1"
          .options=${{ enableRating: false }}
        ></oryx-product-card>
      `);
    });

    it('should not render oryx-product-average-rating', () => {
      expect(element).not.toContainElement('oryx-product-average-rating');
    });
  });

  describe('when enableLabels = false', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-product-card
          uid="1"
          .options=${{ enableLabels: false }}
        ></oryx-product-card>
      `);
    });

    it('should not render product-labels', () => {
      expect(element).not.toContainElement('oryx-product-labels');
    });
  });

  describe('when enableWishlist = false', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-product-card
          uid="1"
          .options=${{ enableWishlist: false }}
        ></oryx-product-card>
      `);
    });

    it('should not render the wishlist button', () => {
      expect(element).not.toContainElement('oryx-icon-button');
    });
  });

  describe('when enableAddToCart = false', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-product-card
          uid="1"
          .options=${{ enableAddToCart: false }}
        ></oryx-product-card>
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
        providers: [
          ...mockProductProviders,
          ...siteProviders,
          {
            provide: RouterService,
            useValue: mockRouterService,
          },
        ],
      });

      element = await fixture(html` <oryx-product-card></oryx-product-card> `);
    });

    it('should not render the content', () => {
      expect(element).not.toContainElement('oryx-content-link');
    });
  });
});
