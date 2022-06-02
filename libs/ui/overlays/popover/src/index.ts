export * from './controllers';
export * from './popover.component';
export * from './popover.controller';
export * from './popover.model';
export * from './styles';

import { PopoverComponent, TAG_NAME } from './popover.component';

customElements.get(TAG_NAME) ||
  customElements.define(TAG_NAME, PopoverComponent);
