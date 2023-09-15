import { LinkOptions } from '@spryker-oryx/site';

export interface DropdownItemOptions {
  icon?: string;
  url?: string | LinkOptions;
}

export interface DropdownItemContent {
  text?: string;
}
