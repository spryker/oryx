import { css } from 'lit';

export const navigationStyles = css`
  :host {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 250px;
    background-color: var(--oryx-color-canvas-100);
    box-shadow: var(--oryx-elevation-0) var(--oryx-elevation-color);
    transition: all var(--oryx-transition-time);
  }

  slot {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  ::slotted(*) {
    text-decoration: none;
  }

  oryx-image[resource='logo'] {
    display: block;
    fill: var(--oryx-color-ink);
    margin: 15px;
    width: 120px;
    transition: inherit;
  }

  :host([collapsed]) {
    width: 96px;
    align-items: stretch;
  }

  :host([collapsed]) oryx-image[resource='logo'] {
    margin-inline-start: 35px;
  }

  oryx-image[resource='logo']::part(wordmark) {
    transition: opacity var(--oryx-transition-time);
  }

  :host([collapsed]) oryx-image[resource='logo']::part(wordmark) {
    opacity: 0;
  }

  oryx-icon-button {
    position: absolute;
    inset-inline-end: -12px;
    inset-block-end: 30px;
  }

  oryx-icon-button button {
    background-color: var(--oryx-color-canvas-100);
    border-color: var(--oryx-color-neutral-200);
  }

  :host([collapsed]) oryx-icon-button oryx-icon {
    transform: rotate(180deg);
  }
`;
