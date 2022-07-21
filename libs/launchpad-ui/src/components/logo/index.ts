import { Logo } from './logo';

customElements.get('oryx-lp-logo') ||
  customElements.define('oryx-lp-logo', Logo);
