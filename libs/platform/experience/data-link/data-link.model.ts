import { IconTypes } from '@spryker-oryx/ui/icon';
import { DataFieldOptions } from '../src/models';

export interface EntityLinkOptions extends DataFieldOptions {
  icon?: IconTypes;
  label?: string;
}
