import { SelectComponent } from './select.component';

export * from './select.component';
export * from './select.controller';
export * from './select.model';
export * from './select.styles';

customElements.get('oryx-select') ||
  customElements.define('oryx-select', SelectComponent);
