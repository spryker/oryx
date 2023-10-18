export interface OryxAppAttributes {
  /**
   * The visual type of Oryx application.
   *
   */
  type?: OryxAppType;
}

/**
 * Represents visual types of Oryx application.
 */
export const enum OryxAppType {
  None = 'none',

  /**
   * Mobile appearance of the application.
   */
  Mobile = 'mobile',
}
