import { MenuListItem } from "@spryker-oryx/ui/menu-item";

// export enum MenuItemTypes {
//   Button = 'button',
//   Icon = 'icon'
// }

export interface UserSummaryOptions {
  items?: MenuListItem[];

  // /**
  //  * Type of the trigger element
  //  *
  //  * @default 'button'
  //  */
  // type?: string

  /**
   * Type of icon for the trigger element
   *
   * @default 'user'
   */
  icon?: string;
}
