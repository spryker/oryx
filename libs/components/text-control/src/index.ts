import { TextControlComponent } from './text-control.component';

customElements.get('oryx-text-control') ||
  customElements.define('oryx-text-control', TextControlComponent);
