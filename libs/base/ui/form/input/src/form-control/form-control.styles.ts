import { screenCss } from '@spryker-oryx/utilities';
import { css } from 'lit';

export const formControlBaseStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    border-color: var(--oryx-color-neutral-5);
  }

  :host([required]) slot[name='label'] {
    padding-inline-end: 0.5em;
    max-width: calc(100% - 0.5em);
    width: auto;
    display: inline-block;
    vertical-align: top;
  }

  :host([required]) slot[name='label']::after {
    content: '*';
    color: var(--oryx-required-asterisk-color, currentColor);
    position: absolute;
    inset-inline-end: 0;
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
    color: var(--oryx-color-neutral-12);
    font-weight: 400;
    font-size: 12px;
    text-transform: var(--oryx-form-label-transform);
    position: relative;
    inset-block-start: -4px;
    line-height: 20px;
  }

  .control {
    display: flex;
    align-items: stretch;
    position: relative;
    border-style: solid;
    border-width: 2px;
    border-color: inherit;
    border-radius: var(
      --oryx-form-control-border-radius,
      var(--oryx-border-radius-medium)
    );
    transition: all var(--oryx-transition-time);
    color: var(--oryx-color-neutral-9);
    background-color: var(--oryx-color-neutral-1);
  }

  :host([disabled]) {
    pointer-events: none;
  }

  :host([disabled]) .control {
    background-color: var(--oryx-color-neutral-3);
  }

  :host(:not([hasError])) .control:hover,
  :host(:not([hasError])) .control:focus-within {
    border-color: var(--oryx-color-neutral-7);
  }

  :host(:not([hasError])) .control:focus-within {
    border-color: var(--oryx-color-focus);
    transition-property: border;
  }

  /* visible focus effect */
  :host([visible-focus]:not([hasError])) .control:focus-within {
    box-shadow: var(--oryx-elevation-0) var(--oryx-color-primary-9);
    transition-property: box-shadow, border;
  }

  slot:not([name])::slotted(*:-webkit-autofill) {
    -webkit-text-fill-color: var(--oryx-color-neutral-12);
    box-shadow: 0 0 0 1000px var(--oryx-color-neutral-1) inset;
  }

  input,
  slot:not([name])::slotted(*) {
    height: 44px;
  }

  input,
  ::slotted(input) {
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
    color: var(--oryx-color-neutral-12);
    border-radius: var(
      --oryx-form-control-border-radius,
      var(--oryx-border-radius-medium)
    );
    line-height: 24px;
  }

  ::slotted(input[disabled]),
  ::slotted(textarea[disabled]) {
    color: var(--oryx-color-neutral-11);
    background-color: var(--oryx-color-neutral-3);
  }

  textarea,
  ::slotted(textarea) {
    min-height: 80px;
    min-width: 100%;
  }

  [hasErrorContent] {
    margin-block-start: 7px;
  }
`;

const largeScreen = css`
  input,
  slot:not([name])::slotted(*) {
    height: 38px;
  }
`;

export const formControlScreenStyles = screenCss({
  lg: largeScreen,
});
