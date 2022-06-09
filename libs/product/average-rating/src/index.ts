import { AverageRatingComponent } from './average-rating.component';

export * from './average-rating.component';
export * from './average-rating.model';

customElements.get('product-average-rating') ||
  customElements.define('product-average-rating', AverageRatingComponent);
