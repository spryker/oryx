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

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    padding: 0;
    position: absolute;
    inset-inline-end: -15px;
    inset-block-end: 30px;
    border-radius: 100%;
    border: none;
    background-color: var(--oryx-color-canvas-100);
    color: var(--oryx-color-neutral-300);
    box-shadow: var(--oryx-elevation-0) var(--oryx-elevation-color);
    transition: inherit;
    cursor: pointer;
  }

  button:hover {
    background-color: var(--oryx-color-primary-300);
    color: var(--oryx-color-canvas-100);
  }

  :host([collapsed]) button oryx-icon {
    transform: rotate(180deg);
  }

  ::slotted(*) {
    text-decoration: none;
  }
`;
