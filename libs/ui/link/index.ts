import { LinkComponent } from './link.component';

export * from './link.component';
export * from './link.model';
export * from './link.styles';

customElements.get('oryx-link') ||
  customElements.define('oryx-link', LinkComponent);
