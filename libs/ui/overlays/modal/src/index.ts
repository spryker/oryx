import { ModalComponent } from './modal.component';
import { NDSModalComponent } from './no-dialog-support/modal.component';

export * from './modal.component';
export * from './modal.model';
export * from './modal.styles';
export * from './no-dialog-support/modal.component';
export * from './no-dialog-support/modal.styles';

customElements.get('oryx-modal') ||
  customElements.define(
    'oryx-modal',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.HTMLDialogElement ? ModalComponent : NDSModalComponent
  );
