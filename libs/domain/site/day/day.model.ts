export interface DayComponentAttributes {
  /**
   * The value property represents the date in milliseconds.
   */
  day?: string;

  /**
   * The i18n token can be used to generate a day inside a text. The i18n token
   * comes with a default token context parameter ("day"), which will generate the following
   * i18n syntax:
   *
   * ```
   * i18n('my.token-<day>', {day: 'monday'})
   * ```
   */
  i18nToken?: string;
}
