export interface PopoverOptions {
  /**
   * Indicates that the user must explicitly select to show the popover,
   * using either the mousedown or enter/space keys.
   *
   * Defaults to true.
   */
  showOnFocus?: boolean;

  /**
   * Indicates that a popover item can be selected.
   *
   * The selected item state remains after the popover is closed. The next time
   * the popover is opened, the selected item is the starting point for (keyboard)
   * navigation.
   *
   * Defaults to true.
   */
  selectable?: boolean;
}

export interface PopoverSelectEvent<T = HTMLElement> {
  selected: T;
}
