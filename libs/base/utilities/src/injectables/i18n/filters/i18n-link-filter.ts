import { I18nContextFilter } from '../i18n-context-filter';

declare global {
  interface I18nContextFilters {
    link: LinkI18nContextFilter;
  }
}

export class LinkI18nContextFilter
  implements I18nContextFilter<'link', LinkI18nContextFilterConfig>
{
  getName(): 'link' {
    return 'link';
  }

  process(value: string, config: LinkI18nContextFilterConfig): string {
    return `<a href="${config.href}"${
      config.target ? ` target="${config.target}"` : ''
    }>${value}</a>`;
  }

  producesHtml(): boolean {
    return true;
  }
}

export interface LinkI18nContextFilterConfig {
  href: string;
  target?: string;
}
