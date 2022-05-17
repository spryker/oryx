import { TagComponent } from './tag.component';

export * from './tag.component';
export * from './tag.styles';

customElements.get('oryx-tag') ||
  customElements.define('oryx-tag', TagComponent);
