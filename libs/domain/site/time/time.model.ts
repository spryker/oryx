export interface SiteTimeComponentAttributes {
  /**
   * The value property represents the time in milliseconds.
   */
  stamp?: number | string | Date;

  /**
   * The i18n token can be used to generate a time inside a text. The i18n token
   * comes with a default token context parameter ("time"), which will generate the following
   * i18n syntax:
   *
   * ```
   * i18n('my.token-<time>', {date: '26-04-2023'})
   * ```
   */
  i18nToken?: string;
}
