import { InputListComponent } from './input-list.component';

export * from './input-list.component';
export * from './input-list.model';
export * from './input-list.styles';

customElements.get('oryx-input-list') ||
  customElements.define('oryx-input-list', InputListComponent);
