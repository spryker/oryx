export interface MenuListItem {
  link: string;
  title: string;
  icon?: string;
}

export interface UserSummaryOptions {
  items?: MenuListItem[];

  // /**
  //  * Type of the trigger element
  //  * 
  //  * @default 'button'
  //  */
  // type?: string

  // /**
  //  * Type of icon for the trigger element
  //  * 
  //  * @default 'user'
  //  */
  // icon?: string

  // /**
  //  * Allow using element as navigation link
  //  */
  // url?: string;

  /**
   * Allow dispatching custom event with given name on click
   */
  eventName?: string;
}
