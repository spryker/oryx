import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import '@spryker-oryx/testing';
import { html } from 'lit';
import { afterEach, beforeEach } from 'vitest';
import { MOCK_PRODUCT_PROVIDERS } from '../../src/mocks';
import '../index';
import { ProductAverageRatingComponent } from './average-rating.component';

describe('Average Rating', () => {
  let element: ProductAverageRatingComponent;

  beforeEach(async () => {
    createInjector({
      providers: MOCK_PRODUCT_PROVIDERS,
    });
    element = await fixture(
      html`<product-average-rating
        sku="1"
        uid="1"
        .content${{ hideReviewCount: true }}
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
        .content="${{ hideReviewCount: false }}"
      ></product-average-rating>`
    );
    const ratingEl: any = element?.shadowRoot?.querySelector('oryx-rating');
    expect(ratingEl.reviewCount).toBe(5);
  });

  it('should not render review count', async () => {
    element = await fixture(
      html`<product-average-rating
        sku="1"
        .content="${{ hideReviewCount: true }}"
      ></product-average-rating>`
    );
    const ratingEl: any = element?.shadowRoot?.querySelector('oryx-rating');
    expect(ratingEl.reviewCount).toBe(undefined);
  });
});
