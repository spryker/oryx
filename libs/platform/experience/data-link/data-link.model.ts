import { IconTypes } from '@spryker-oryx/ui/icon';
import { DataFieldComponentOptions } from '../src/models';

export interface DataLinkComponentOptions extends DataFieldComponentOptions {
  icon?: IconTypes;
  label?: string;
}
