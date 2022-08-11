import { componentDef } from '@spryker-oryx/core';

export * from './modal.component';
export * from './modal.model';
export * from './modal.styles';
export * from './no-dialog-support/modal.component';
export * from './no-dialog-support/modal.styles';

export const modalComponent = componentDef({
  name: 'oryx-modal',
  impl: () =>
    window.HTMLDialogElement
      ? import('./modal.component').then((m) => m.ModalComponent)
      : import('./no-dialog-support/modal.component').then(
          (m) => m.NDSModalComponent
        ),
});
