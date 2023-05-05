import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { ExperienceService } from '@spryker-oryx/experience';
import { Product } from '@spryker-oryx/product';
import {
  mockProductProviders,
  MockProductService,
} from '@spryker-oryx/product/mocks';
import { RatingComponent } from '@spryker-oryx/ui/rating';
import { Size } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { Observable, of } from 'rxjs';
import { ProductAverageRatingComponent } from './average-rating.component';
import { productAverageRatingComponent } from './average-rating.def';

class MockExperienceContentService implements Partial<ExperienceService> {
  getOptions = ({ uid = '' }): Observable<any> => of({});
}

describe('Average Rating', () => {
  let element: ProductAverageRatingComponent;

  const getRating = (): RatingComponent => {
    return element.renderRoot.querySelector('oryx-rating') as RatingComponent;
  };

  const getProduct = (productSku: string): Product => {
    return MockProductService.mockProducts.find(
      ({ sku }) => productSku === sku
    ) as Product;
  };

  beforeAll(async () => {
    await useComponent(productAverageRatingComponent);
  });

  beforeEach(async () => {
    createInjector({
      providers: [
        ...mockProductProviders,
        {
          provide: ExperienceService,
          useClass: MockExperienceContentService,
        },
      ],
    });
  });

  afterEach(() => {
    destroyInjector();
  });

  describe('when the product has a review count', () => {
    beforeEach(async () => {
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
      expect(getRating().value).toBe(getProduct('1').averageRating);
    });

    it('should pass reviewCount to oryx-rating', () => {
      expect(getRating().reviewCount).toBe(getProduct('1').reviewCount);
    });
  });

  describe('when product has no reviews', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-product-average-rating
          sku="3"
        ></oryx-product-average-rating>`
      );
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should set default reviewCount for the oryx-rating', () => {
      expect(getRating().reviewCount).toBe(0);
    });

    it('should not pass the average rating to the oryx-rating', () => {
      expect(getRating().value).toBe(undefined);
    });
  });

  describe('when enableCount is false', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-product-average-rating
          sku="1"
          .options="${{ enableCount: false }}"
        ></oryx-product-average-rating>`
      );
    });

    it('should not set reviewCount for the oryx-rating', () => {
      expect(getRating().reviewCount).toBe(undefined);
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
      expect(getRating().size).toBe(Size.Sm);
    });
  });
});
