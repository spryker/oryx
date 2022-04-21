import { ButtonComponent } from './button.component';

export * from './button.component';
export * from './button.model';
export * from './button.styles';

customElements.get('oryx-button') ||
  customElements.define('oryx-button', ButtonComponent);
