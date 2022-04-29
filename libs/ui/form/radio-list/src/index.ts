import { RadioListComponent } from './radio-list.component';

export * from './radio-list.component';
export * from './radio-list.styles';

customElements.get('oryx-radio-list') ||
  customElements.define('oryx-radio-list', RadioListComponent);
