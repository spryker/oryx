import { MicroFrontendComponent } from './micro-frontend';

customElements.get('oryx-micro-frontend') ||
  customElements.define('oryx-micro-frontend', MicroFrontendComponent);
