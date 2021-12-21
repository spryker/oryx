import { IconComponent } from './oryx-icon.component';

customElements.get('oryx-icon') ||
  customElements.define('oryx-icon', IconComponent);
