import { I18nContextFilter } from '../i18n-context-filter';
import { LinkI18nContextFilter } from './i18n-link-filter';

export * from './i18n-link-filter';

export const defaultI18nContextFilters: I18nContextFilter[] = [
  new LinkI18nContextFilter(),
];
