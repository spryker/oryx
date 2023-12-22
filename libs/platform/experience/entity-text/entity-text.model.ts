import { HeadingTag } from '@spryker-oryx/ui/heading';
import { DataFieldOptions } from '../src/models';

export interface EntityTextOptions extends DataFieldOptions {
  tag?: HeadingTag;
  prefix?: string;
  link?: boolean;
}
