import { ContentLinkComponent } from './link.component';

export * from './link.component';
export * from './link.model';
export * from './link.styles';

customElements.get('content-link') ||
  customElements.define('content-link', ContentLinkComponent);
