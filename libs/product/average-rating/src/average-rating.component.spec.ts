import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { ExperienceService } from '@spryker-oryx/experience';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import '@spryker-oryx/testing';
import { html } from 'lit';
import { Observable, of } from 'rxjs';
import { mockProductProviders } from '../../src/mocks';
import { ProductAverageRatingComponent } from './average-rating.component';
import { productAverageRatingComponent } from './component';

class MockExperienceContentService implements Partial<ExperienceService> {
  getOptions = ({ uid = '' }): Observable<any> => of({});
}

describe('Average Rating', () => {
  let element: ProductAverageRatingComponent;

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
    element = await fixture(
      html`<product-average-rating
        sku="1"
        uid="1"
        .options=${{ hideReviewCount: true }}
      ></product-average-rating>`
    );
  });

  afterEach(() => {
    destroyInjector();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('should is defined', () => {
    expect(element).toBeInstanceOf(ProductAverageRatingComponent);
  });

  it('should render review count', async () => {
    element = await fixture(
      html`<product-average-rating
        sku="1"
        .options="${{ hideReviewCount: false }}"
      ></product-average-rating>`
    );
    const ratingEl: any = element?.shadowRoot?.querySelector('oryx-rating');
    expect(ratingEl.reviewCount).toBe(5);
  });

  it('should not render review count', async () => {
    element = await fixture(
      html`<product-average-rating
        sku="1"
        .options="${{ hideReviewCount: true }}"
      ></product-average-rating>`
    );
    const ratingEl: any = element?.shadowRoot?.querySelector('oryx-rating');
    expect(ratingEl.reviewCount).toBe(undefined);
  });
});
