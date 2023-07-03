import { I18nContext } from './i18n.injectable';

export interface I18nContextFilter<
  TName extends string = string,
  TConfig extends object = object
> {
  getName(): TName;
  process(value: string, config: TConfig, context?: I18nContext): string;
  producesHtml?(): boolean;
}
