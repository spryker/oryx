export interface Dialog {
  open: boolean;
  show(): void;
  close(returnValue?: string): void;
  showModal(): void;
}

export interface DialogElement extends Dialog, HTMLDialogElement {}
