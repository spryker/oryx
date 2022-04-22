import { ToggleComponent } from './toggle.component';

export * from './toggle.component';
export * from './toggle.styles';

customElements.get('oryx-toggle') ||
  customElements.define('oryx-toggle', ToggleComponent);
