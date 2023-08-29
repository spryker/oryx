import { I18nContext } from '@spryker-oryx/utilities';

export interface BreadcrumbItem {
  text?: string | { token: string | readonly string[]; values?: I18nContext };
  url?: string;
}
