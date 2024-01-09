export const POPOVER_HEIGHT = 320;

export interface PopoverOptions {
  /**
   * Indicates that the user must explicitly select to show the popover,
   * using either the mousedown or enter/space keys.
   *
   * Defaults to false.
   *
   * @deprecated since version 1.4 use openOnHover on the host element instead
   */
  showOnFocus?: boolean;

  /**
   * html element for getting bounding size
   * to set position of popover and to fit its size
   *
   * Defaults to undefined
   */
  boundingElement?: HTMLElement;
}

export interface PopoverSelectEvent<T = HTMLElement> {
  selected?: T;
}

export const CLOSE_EVENT = 'oryx.close';
export const CANCEL_EVENT = 'oryx.cancel';
export const POPOVER_EVENT = 'oryx.popover';

/**
 * html attribute that indicates element as closing trigger
 * for popover
 */
export const CLOSE_POPOVER_ATTR = 'close-popover';
