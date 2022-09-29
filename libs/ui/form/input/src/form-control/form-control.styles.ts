import { css } from 'lit';
import { breakpoints } from '../../../../.constants';

export const formControlStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    border-color: var(--oryx-color-neutral-light);
  }

  label {
    border-color: inherit;
    cursor: pointer;
  }

  slot[name='label'] {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: inherit;
    color: var(--oryx-color-ink);
    font-weight: 400;
    font-size: 12px;
    text-transform: uppercase;
    position: relative;
    top: -4px;
    line-height: 20px;
  }

  .control {
    display: flex;
    align-items: stretch;
    position: relative;
    border-style: solid;
    border-width: 2px;
    border-color: inherit;
    border-radius: var(--oryx-border-radius);
    transition: all var(--oryx-transition-time);
    color: var(--oryx-color-neutral-dark);
    background-color: var(--oryx-color-canvas);
  }

  :host([disabled]) {
    pointer-events: none;
  }

  :host([disabled]) .control {
    border-radius: var(--oryx-border-radius);
    background-color: var(--oryx-color-neutral-lighter);
  }

  :host(:not([hasError])) .control:hover,
  :host(:not([hasError])) .control:focus-within {
    border-color: var(--oryx-color-neutral);
  }

  :host(:not([hasError])) .control:focus-within {
    border-color: var(--oryx-color-focus);
    transition-property: border;
  }

  /* visible focus effect */
  :host([visible-focus]:not([hasError])) .control:focus-within {
    box-shadow: var(--oryx-elevation-0) var(--oryx-color-brand);
    transition-property: box-shadow, border;
  }

  slot:not([name])::slotted(*:-webkit-autofill) {
    -webkit-text-fill-color: var(--oryx-color-ink);
  }

  input,
  ::slotted(input) {
    height: 38px;
    box-sizing: border-box;
    text-overflow: ellipsis;
  }

  input,
  ::slotted(input),
  textarea,
  ::slotted(textarea) {
    width: 100%;
    box-sizing: border-box;
    padding: 7px 11px;
    background-color: transparent;
    border: none;
    outline: none;
    font: inherit;
    color: var(--oryx-color-ink);
    border-radius: var(--oryx-border-radius);
    line-height: 24px;
  }

  ::slotted(input[disabled]),
  ::slotted(textarea[disabled]) {
    color: var(--oryx-color-neutral-darker);
    background-color: var(--oryx-color-neutral-lighter);
  }

  textarea,
  ::slotted(textarea) {
    min-height: 80px;
    min-width: 100%;
  }

  [hasErrorContent] {
    margin-block-start: 7px;
  }

  @media (max-width: ${breakpoints.tablet}px) {
    input,
    slot:not([name])::slotted(*) {
      height: 44px;
    }
  }
`;
