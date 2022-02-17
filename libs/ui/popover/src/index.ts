export * from './popover.component';
export * from './popover.controller';
export * from './popover.model';
export * from './popover.styles';

import { PopoverComponent } from './popover.component';

customElements.get('oryx-popover') ||
  customElements.define('oryx-popover', PopoverComponent);
