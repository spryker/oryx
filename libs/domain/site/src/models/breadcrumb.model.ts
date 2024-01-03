import { I18nContent, RequireAtLeastOneProp } from '@spryker-oryx/utilities';

export interface BreadcrumbItem {
  text?: RequireAtLeastOneProp<I18nContent, 'raw' | 'token'>;
  url?: string;
}
