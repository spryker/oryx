import { ToggleIconComponent } from './toggle-icon.component';

export * from './toggle-icon.component';
export * from './toggle-icon.styles';

customElements.get('oryx-toggle-icon') ||
  customElements.define('oryx-toggle-icon', ToggleIconComponent);
