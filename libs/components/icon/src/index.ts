import { IconComponent } from './icon.component';

customElements.get('oryx-icon') ||
  customElements.define('oryx-icon', IconComponent);
