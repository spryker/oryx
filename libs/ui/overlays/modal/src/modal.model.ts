export const CLOSE_EVENT = 'oryx.close';

export interface ModalProperties {
  isOpen?: boolean;
  disableCloseOnEscape?: boolean;
  disableCloseOnBackdrop?: boolean;
  header?: string;
  open: () => void;
  close: () => void;
}
