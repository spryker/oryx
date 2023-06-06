export interface DateComponentAttributes {
  /**
   * The value property represents the date in milliseconds.
   */
  stamp?: number | string | Date;

  /**
   * The i18n token can be used to generate a date inside a text. The i18n token
   * comes with a default token context parameter ("date"), which will generate the following
   * i18n syntax:
   *
   * ```
   * i18n('my.token-<date>', {date: '26-04-2023'})
   * ```
   */
  i18nToken?: string;
}
