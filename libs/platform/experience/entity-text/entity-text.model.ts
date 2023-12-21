import { HeadingTag } from '@spryker-oryx/ui/heading';
import { EntityFieldOptions } from '../src/models';

export interface EntityTextOptions extends EntityFieldOptions {
  tag?: HeadingTag;
  prefix?: string;
  link?: boolean;
}
