import { Size } from '@spryker-oryx/utilities';

export interface ButtonComponentAttributes {
  size?: Size;

  type?: ButtonType;

  /**
   * Indicates that the button is in loading state. This property is reflected in the DOM
   * so that a loading (spinner) effect can be rendered on the button.
   */
  loading?: boolean;

  /**
   * Indicates that the button is in confirmed state. This property is reflected in the DOM
   * so that an effect can be rendered on the button.
   *
   * The confirmation effect is typically rendered temporarily after a user clicked on the
   * button, for example when an item is added to cart.
   */
  confirmed?: boolean;

  outline?: boolean;
}

export enum ButtonType {
  Primary = 'primary',
  Secondary = 'secondary',
  Critical = 'critical',
  Text = 'text',
}
