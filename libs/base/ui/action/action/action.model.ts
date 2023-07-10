import { Size } from '@spryker-oryx/utilities';
import { Icons } from '../../graphical/icon/src';

export interface ActionComponentAttributes {
  label?: string;
  icon?: Icons | string;

  /**
   * @default ButtonType.Solid
   */
  type?: ButtonType;

  /**
   * @default Size.Lg
   */
  size?: Size;

  /**
   * @default ButtonColor.Primary
   */
  color?: ButtonColor; // extend AlertType
}

export const enum ButtonColor {
  Primary = 'primary',
  Secondary = 'secondary',
}

export const enum ButtonType {
  Solid = 'solid',
  Outline = 'outline',
  Icon = 'icon',
}
