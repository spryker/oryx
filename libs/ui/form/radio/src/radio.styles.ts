import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
  }

  label {
    display: flex;
    align-items: center;
    gap: 8px;
    position: relative;
    outline: 0;
    color: var(--oryx-color-inc);
    font-size: 14px;
    font-weight: 500;
  }

  ::slotted(input) {
    flex: 0 0 18px;
    width: 18px;
    height: 18px;
    appearance: none;
    border-radius: 50%;
    margin: 3px 0;
    padding: 2px;
    border: solid 2px currentColor;
    color: var(--oryx-color-neutral);
  }

  ::slotted(input:checked) {
    background-clip: content-box;
    /* stylelint-disable-next-line */
    background-image: linear-gradient(currentColor 0%, currentColor 100%);
    color: var(--oryx-color-brand);
  }

  ::slotted(:not(input)) {
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  ::slotted(input)::after {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    inset-block-start: 0;
    inset-inline-start: 0;
    cursor: pointer;
  }

  ::slotted(input:hover) {
    color: var(--oryx-color-neutral-dark);
  }

  ::slotted(input:focus-visible) {
    outline: 0;
    box-shadow: 0 0 3px var(--oryx-color-focus);
    border-color: var(--oryx-color-focus);
  }

  :host([hasError]) ::slotted(input:focus-visible) {
    border-color: var(--oryx-color-error);
  }

  ::slotted(input:disabled),
  ::slotted(input:checked:disabled) {
    background-color: var(--oryx-color-neutral-lighter);
    color: var(--oryx-color-neutral-dark);
    border-color: var(--oryx-color-neutral-light);
    pointer-events: none;
  }

  ::slotted(input:checked:hover) {
    color: var(--oryx-color-brand-dark);
  }

  :host([hasError]) ::slotted(input),
  :host([hasError]) ::slotted(input:checked) {
    border-color: var(--oryx-color-error);
  }

  [hasErrorContent] {
    margin-block-start: 1px;
    margin-inline-start: 1px;
    font-size: 12px;
    font-weight: 400;
  }
`;
