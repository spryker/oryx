import { componentDef } from '@spryker-oryx/core';
import { isServer } from 'lit';

export const modalComponent = componentDef({
  name: 'oryx-modal',
  impl: () =>
    !isServer && window.HTMLDialogElement
      ? import('./modal.component').then((m) => m.ModalComponent)
      : import('./no-dialog-support/modal.component').then(
          (m) => m.NDSModalComponent
        ),
});
