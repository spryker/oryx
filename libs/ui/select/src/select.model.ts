export interface SelectOptions {
  /**
   * Indicates that the select will always have an empty value, even if the
   * options do not have an empty value.
   *
   * HTML `<select>` requires one of the options to be selected, which means
   * that if the list of options does not come with an empty value, it is not
   * possible to have an empty value. Hence, when using this option, an empty
   *  option is generated.
   *
   * This feature does only work when the `select` control is used. When an
   * `input` control is used, an empty value works by default.
   */
  allowEmptyValue?: boolean;
}
