import { I18nContext } from '@spryker-oryx/utilities';

/**
 * @deprecated since 1.4. Use I18nContent interface
 * from '@spryker-oryx/utilities' instead.
 */
export interface TextResource {
  raw?: string;
  token?: string | readonly string[];
  values?: I18nContext;
}
