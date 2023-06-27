import { Position } from '@spryker-oryx/ui';

export enum DrawerType {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
}

export interface DrawerProperties {
  /**
   *
   */
  open?: boolean;

  /**
   * The drawer supports to positions, `Position.START` and `Position.END`.
   *
   * Start and end are logical positions, the location depends on the direction
   * of reading (i.e. start position is at the left side in an left-to-right
   * reading direction).
   *
   * Defaults to start.
   */
  position?: Position;

  /**
   * Indicates whether the drawer is maximized. This property is used internally
   * when the drawer is resizable.
   *
   * Defaults to undefined.
   */
  maximize?: boolean;

  /**
   * The drawer supports two drawer types, `DrawerType.PRIMARY` and `DrawerType.SECONDARY`.
   * The drawer type only influences the visual UI and does not bring any functional changes.
   *
   * Defaults to primary.
   */
  type?: DrawerType;

  /**
   * Indicates whether the drawer can be resized to the full with of the screen.
   * Resized only related to full width (AKA maximized) or standard width.
   *
   * Defaults to `false`.
   */
  notResizable?: boolean;

  /**
   * Indicates whether the drawer comes with a close button.
   *
   * This wont influence the usage of the escape key to close the drawer.
   *
   * Defaults to `false`.
   */
  notClosable?: boolean;
}
