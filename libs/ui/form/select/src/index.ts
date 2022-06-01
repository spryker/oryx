import { SelectComponent } from './select.component';

export * from './controllers';
export * from './select.component';
export * from './select.model';
export * from './styles';

customElements.get('oryx-select') ||
  customElements.define('oryx-select', SelectComponent);
