import { RadioComponent } from './radio.component';

export * from './radio.component';
export * from './radio.styles';

customElements.get('oryx-radio') ||
  customElements.define('oryx-radio', RadioComponent);
