import { CheckboxComponent } from './checkbox.component';

export * from './checkbox.component';
export * from './checkbox.model';
export * from './checkbox.styles';

customElements.get('oryx-checkbox') ||
  customElements.define('oryx-checkbox', CheckboxComponent);
