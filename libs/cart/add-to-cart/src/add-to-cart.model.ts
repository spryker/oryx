export interface AddToCartOptions {
  /**
   * Defines if the quantity-input component should be shown.
   * If the value is "true" then the add to cart request will always have "quantity: 1" in payload
   */
  hideQuantityInput: boolean;

  /**
   * Defines if the submit button should be disabled (e.i. when product is unavailable)
   */
  disabled: boolean;

  /**
   * Defines if the submit button should have outlined appearance by default
   */
  outlined: boolean;
}
