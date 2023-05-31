import { css } from 'lit';

export const styles = css`
  ::slotted(*)::before {
    content: '';
    width: 1px;
    background: var(--oryx-color-neutral-6);
    height: 100%;
    position: absolute;
    inset-block-start: 0;
    inset-inline-start: 23.5px;
  }

  ::slotted(:first-child)::before {
    content: '';
    width: 1px;
    height: calc(100% - 20px);
    background: var(--oryx-color-neutral-6);
    position: absolute;
    inset-block-start: 20px;
    inset-inline-start: 23.5px;
  }

  ::slotted(:last-child)::before {
    content: '';
    width: 1px;
    background: var(--oryx-color-neutral-6);
    height: 20px;
    position: absolute;
    inset-block-start: 0;
    inset-inline-start: 23.5px;
  }

  ::slotted(:first-child)::after,
  ::slotted(*)::after {
    content: '';
    width: 1px;
    height: 10px;
    background: var(--oryx-color-neutral-6);
    position: absolute;
    inset-block-end: -11px;
    inset-inline-start: 23.5px;
  }

  ::slotted(:last-child)::after {
    display: none;
  }

  ::slotted(:only-child)::before {
    content: '';
    display: none;
  }
`;
