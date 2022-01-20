import { InputComponent } from './input.component';

customElements.get('oryx-input') ||
  customElements.define('oryx-input', InputComponent);
