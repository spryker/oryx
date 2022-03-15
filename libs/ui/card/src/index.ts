import { CardComponent } from './card.component';

export * from './card.component';
export * from './card.model';

customElements.get('oryx-card') ||
  customElements.define('oryx-card', CardComponent);
