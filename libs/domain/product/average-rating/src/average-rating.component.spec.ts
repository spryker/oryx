import { fixture } from '@open-wc/testing-helpers';
import { ContextService, DefaultContextService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import {
  ProductService,
  productAverageRatingComponent,
} from '@spryker-oryx/product';
import { RatingComponent } from '@spryker-oryx/ui/rating';
import { Size, useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { ProductAverageRatingComponent } from './average-rating.component';

class MockProductService implements Partial<ProductService> {
  get = vi.fn();
}

describe('Average Rating', () => {
  let element: ProductAverageRatingComponent;
  let productService: MockProductService;

  beforeAll(async () => {
    await useComponent(productAverageRatingComponent);
  });

  beforeEach(async () => {
    const injector = createInjector({
      providers: [
        {
          provide: ProductService,
          useClass: MockProductService,
        },
        {
          provide: ContextService,
          useClass: DefaultContextService,
        },
      ],
    });

    productService = injector.inject<MockProductService>(ProductService);
  });

  afterEach(() => {
    destroyInjector();
  });

  describe('when the product has a review count', () => {
    beforeEach(async () => {
      productService.get.mockReturnValue(
        of({ sku: '1', averageRating: 3.5, reviewCount: 5 })
      );
      element = await fixture(
        html`<oryx-product-average-rating
          sku="1"
        ></oryx-product-average-rating>`
      );
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should pass averageRating to oryx-rating', () => {
      const e = element.renderRoot.querySelector(
        'oryx-rating'
      ) as RatingComponent;
      expect(e.value).toBe(3.5);
    });

    it('should pass reviewCount to oryx-rating', () => {
      const e = element.renderRoot.querySelector(
        'oryx-rating'
      ) as RatingComponent;
      expect(e.reviewCount).toBe(5);
    });
  });

  describe('when product has no reviews', () => {
    beforeEach(async () => {
      productService.get.mockReturnValue(of({ sku: '1' }));
      element = await fixture(
        html`<oryx-product-average-rating
          sku="1"
        ></oryx-product-average-rating>`
      );
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should set default reviewCount for the oryx-rating', () => {
      const e = element.renderRoot.querySelector(
        'oryx-rating'
      ) as RatingComponent;
      expect(e.reviewCount).toBe(0);
    });

    it('should not pass the average rating to the oryx-rating', () => {
      const e = element.renderRoot.querySelector(
        'oryx-rating'
      ) as RatingComponent;
      expect(e.value).toBe(undefined);
    });
  });

  describe('when enableCount is false', () => {
    beforeEach(async () => {
      productService.get.mockReturnValue(
        of({ sku: '1', averageRating: 3.5, reviewCount: 5 })
      );

      element = await fixture(
        html`<oryx-product-average-rating
          sku="1"
          .options="${{ enableCount: false }}"
        ></oryx-product-average-rating>`
      );
    });

    it('should set default reviewCount for the oryx-rating', () => {
      const e = element.renderRoot.querySelector(
        'oryx-rating'
      ) as RatingComponent;
      expect(e.reviewCount).toBe(undefined);
    });
  });

  describe('when size options is provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-product-average-rating
          sku="1"
          .options="${{ size: Size.Sm }}"
        ></oryx-product-average-rating>`
      );
    });

    it('should pass the size to the oryx-rating', async () => {
      const e = element.renderRoot.querySelector(
        'oryx-rating'
      ) as RatingComponent;
      expect(e.size).toBe(Size.Sm);
    });
  });
});
