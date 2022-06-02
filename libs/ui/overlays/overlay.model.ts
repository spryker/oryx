export interface Dialog {
  open: boolean;
  show(): void;
  close(): void;
  showModal(): void;
}

export interface DialogElement extends Dialog, HTMLDialogElement {}
