/**
 * @deprecated since 1.4, use CLOSE_MODAL_EVENT instead.
 */
export const CLOSE_EVENT = 'oryx.close';

/**
 * @deprecated since 1.4, use BACK_MODAL_EVENT instead.
 */
export const BACK_EVENT = 'oryx.back';

export const CLOSED_MODAL_EVENT = 'oryx.modal.closed';
export const CLOSE_MODAL_EVENT = 'oryx.modal.close';
export const BACK_MODAL_EVENT = 'oryx.modal.back';

export interface ModalProperties {
  /**
   * Indicates whether the modal is open.
   */
  isOpen?: boolean;

  /**
   * Indicates whether the modal can be closed by button in the header.
   */
  enableCloseButtonInHeader?: boolean;

  /**
   * Indicates whether the modal can be closed by pressing the escape key.
   */
  enableCloseByEscape?: boolean;

  /**
   * Indicates whether the modal can be closed by clicking on the backdrop.
   */
  enableCloseByBackdrop?: boolean;

  /**
   * Indicates whether the modal has a footer.
   */
  enableFooter?: boolean;

  /**
   * Indicates whether the modal has a back button.
   *
   * When the back navigation is enabled, the closing actions, such as escape-key,
   * backdrop-click, close button and cancel (footer) button will no longer close
   * the modal. The host component must take care of handling the inner navigation
   * of the modal content by handling the `oryx.back` event.
   */
  enableNavigateBack?: boolean;

  /**
   * The heading text for the modal.
   */
  heading?: string;

  /**
   * Indicates that the modal will not grow out the given modal width.
   */
  minimal?: boolean;

  /**
   * A method that opens the modal.
   */
  open: () => void;

  /**
   * A method that closes the modal.
   */
  close: () => void;
}
