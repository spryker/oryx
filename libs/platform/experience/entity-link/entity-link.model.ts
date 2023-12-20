import { IconTypes } from '@spryker-oryx/ui/icon';

// will be reused by all entity field components
export interface EntityFieldOptions {
  entity?: string;
  field?: string;
}

export interface EntityLinkOptions extends EntityFieldOptions {
  icon?: IconTypes;
  label?: string;
}
