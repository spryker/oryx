export const UPDATE_EVENT = 'update';
export const SUBMIT_EVENT = 'submit';

export interface QuantityInputAttributes {
  /**
   * Label above input
   */
  label?: string;

  /**
   * The minimum quantity ensures that the user cannot input below the minimum
   * quantity.
   *
   * @default 0
   */
  min?: number;

  /**
   * The maximum quantity ensures that the user cannot go above this quantity. There's
   * no default value given, since the minimum quantity might not be limited.
   */
  max?: number;

  /**
   * Allows to provide a custom step to change the quantity using the up/down icons or the
   * arrow keys. E.g. if the step is set to `0.1`, the quantity alters by 0.1 each time.
   *
   * @default 1
   */
  step?: number;

  /**
   * A submit event is triggered when the input change event is triggered. A change event happens natively
   * when the user changes the input with the UI (de/increase buttons) or when the field is blurred. This might
   * be to much automation for the user, which is why this behaviour can be turned of by using this flag. When
   * this property is set to true, every change event will result in a submit event.
   *
   * @default false
   */
  submitOnChange?: boolean;

  /**
   * Indicates that the input and the controls are disabled.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Indicates that the input value is invalid.
   *
   * @default false
   */
  hasError?: boolean;

  /**
   * The icon type used to render the decrease button icon.
   *
   * @default IconTypes.Minus
   */
  decreaseIcon?: string;

  /**
   * The icon type used to render the increase button icon.
   *
   * @default IconTypes.Add
   */
  increaseIcon?: string;
}

export interface QuantityEventDetail {
  quantity: number;
  isInvalid?: boolean;
}
