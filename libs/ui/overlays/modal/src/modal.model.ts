export const CLOSE_EVENT = 'oryx.close';

export interface ModalProperties {
  isOpen?: boolean;
  preventCloseWithEscape?: boolean;
  preventCloseWithBackdrop?: boolean;
  withoutCloseButton?: boolean;
  withoutFooter?: boolean;
  header?: string;
  open: () => void;
  close: () => void;
}
