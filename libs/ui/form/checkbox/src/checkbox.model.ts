export interface CheckboxProperties {
  /**
   * The intermediate state is a pure visual state, that is not related
   * to the actual value of the checkbox. Since the intermediate is not
   * available to the `<input />` element, it can be set artificial by
   * setting this boolean value.
   *
   * The intermediate state is unrelated to the actual state of the input
   * element.
   */
  intermediate?: boolean;
}
