export * from './rating.component';
export * from './rating.model';
export * from './styles';

import { RatingComponent } from './rating.component';

customElements.get('oryx-rating') ||
  customElements.define('oryx-rating', RatingComponent);
