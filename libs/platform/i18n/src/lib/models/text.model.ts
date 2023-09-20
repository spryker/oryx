import { I18nContext } from '@spryker-oryx/utilities';

export interface TextResource {
  raw?: string;
  token?: string | readonly string[];
  values?: I18nContext;
}
