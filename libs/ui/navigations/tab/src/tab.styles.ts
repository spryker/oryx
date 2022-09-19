import { css } from 'lit';

export const tabStyles = css`
  :host {
    display: flex;
    flex: 1 0 auto;
    min-height: 46px;
    min-width: 90px;
    border-block-end: 2px solid var(--oryx-color-neutral-light);
    color: var(--oryx-color-neutral-dark);
    background: none;
    line-height: var(--oryx-line-height-base);
    padding: 0 24px;
    justify-content: center;
    align-items: center;
    text-align: center;
    white-space: nowrap;
    margin: 0;
    gap: 4px;
  }

  @media (max-width: 767px) {
    :host {
      border-width: 4px;
    }
  }

  :host:focus-within {
    color: var(--oryx-color-ink);
    border-color: var(--oryx-color-neutral-darker);
  }

  :host(:not([selected]):hover) {
    color: var(--oryx-color-ink);
    border-color: var(--oryx-color-neutral-darker);
  }

  :host([selected]) {
    border-color: var(--oryx-color-brand);
    color: var(--oryx-color-brand);
  }

  :host([selected][error]) {
    border-color: var(--oryx-color-error);
    color: var(--oryx-color-error);
  }

  :host(:not([selected])[error]) {
    border-color: var(--oryx-color-neutral-light);
    color: var(--oryx-color-error);
  }
`;
