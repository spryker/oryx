export * from './icon.component';
export * from './icon.factory';
export * from './icon.model';
import { IconComponent } from './icon.component';

customElements.get('oryx-icon') ||
  customElements.define('oryx-icon', IconComponent);
