import { CheckboxListComponent } from './checkbox-list.component';

export * from './checkbox-list.component';
export * from './checkbox-list.model';
export * from './checkbox-list.styles';

customElements.get('oryx-checkbox-list') ||
  customElements.define('oryx-checkbox-list', CheckboxListComponent);
