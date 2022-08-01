import { TAG_NAME, UserLogoutComponent } from './logout.component';

export * from './logout.component';
export * from './logout.model';

customElements.get(TAG_NAME) ||
  customElements.define(TAG_NAME, UserLogoutComponent);
