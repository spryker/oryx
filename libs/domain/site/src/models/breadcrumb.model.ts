import { TextResource } from '@spryker-oryx/i18n';
import { RequireAtLeastOneProp } from '@spryker-oryx/utilities';

export interface BreadcrumbItem {
  text?: RequireAtLeastOneProp<TextResource, 'raw' | 'token'>;
  url?: string;
}
