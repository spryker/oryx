export {};

declare global {
  export interface LayoutStylesProperties {
    /**
     * Specifies how the element's content object should be fitted to the containing
     * element's box.
     */
    imageFit?: ObjectFit;
    /**
     * Specifies the alignment of the replaced element's content object within the
     * element's box.
     */
    imagePosition?: string;
  }
}

export const enum ObjectFit {
  /**
   * The replaced content is sized to fill the element's content box. The entire object
   * will completely fill the box. If the object's aspect ratio does not match the aspect
   * ratio of its box, then the object will be stretched to fit.
   */
  Fill = 'fill',
  /**
   * The replaced content is scaled to maintain its aspect ratio while fitting within the
   * element's content box. The entire object is made to fill the box, while preserving
   * its aspect ratio, so the object will be "letterboxed" if its aspect ratio does not
   * match the aspect ratio of the box.
   */
  Contain = 'contain',
  /**
   * The replaced content is sized to maintain its aspect ratio while filling the element's
   * entire content box. If the object's aspect ratio does not match the aspect ratio of
   * its box, then the object will be clipped to fit.
   */
  Cover = 'cover',
  /**
   * The replaced content is not resized.
   */
  None = 'none',
  /**
   * The content is sized as if none or contain were specified, whichever would result in a
   * smaller concrete object size.
   */
  ScaleDown = 'scale-down',
}
