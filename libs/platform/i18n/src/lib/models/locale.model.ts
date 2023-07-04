export interface Locale {
  name: string;
  code: string;
}

export interface I18nString extends String {
  hasHtml?: boolean;
}
