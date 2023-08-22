export interface Breadcrumb {
  text?: string;
  i18n?: { token: string; values?: Record<string, string | number> };
  url?: string;
}
