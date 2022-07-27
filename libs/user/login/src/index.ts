import { TAG_NAME, UserLoginComponent } from './login.component';

export * from './login.component';
export * from './login.model';
export * from './login.styles';

customElements.get(TAG_NAME) ||
  customElements.define(TAG_NAME, UserLoginComponent);
