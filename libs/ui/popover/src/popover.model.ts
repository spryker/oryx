export const POPOVER_MAX_HEIGHT_FALLBACK = 320;
export const POPOVER_HEIGHT_MARGIN = 20;

export interface PopoverOptions {
  /**
   * Indicates that the user must explicitly select to show the popover,
   * using either the mousedown or enter/space keys.
   *
   * Defaults to true.
   */
  showOnFocus?: boolean;
}

export interface PopoverSelectEvent<T = HTMLElement> {
  selected?: T;
}
