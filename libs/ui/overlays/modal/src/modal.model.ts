export interface ModalProperties {
  isOpen?: boolean;
  disableCloseOnEscape?: boolean;
  disableCloseOnBackdrop?: boolean;
  header?: string;
  open: () => void;
  close: () => void;
}

export interface DialogElement extends HTMLDialogElement {
  showModal(): void;
  show(): void;
  close(): void;
}
