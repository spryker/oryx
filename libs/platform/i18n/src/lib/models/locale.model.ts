export interface Locale {
  name: string;
  code: string;
}

export type I18nString = string & {
  hasHtml?: boolean;
};
