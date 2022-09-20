import { css } from 'lit';

export const navigationStyles = css`
  :host {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 250px;
    background-color: var(--oryx-color-canvas);
    box-shadow: var(--oryx-elevation-0) var(--oryx-elevation-color);
    transition: all var(--oryx-transition-time);
  }

  slot {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  svg {
    fill: var(--oryx-color-ink);
    margin: 15px;
    width: 120px;
    transition: inherit;
  }

  :host([collapsed]) {
    width: 96px;
    align-items: stretch;
  }

  :host([collapsed]) svg {
    margin-inline-start: 35px;
  }

  .letter-logo {
    transition: inherit;
  }

  :host([collapsed]) .letter-logo {
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
    bottom: 30px;
    border-radius: 100%;
    border: none;
    background-color: var(--oryx-color-canvas);
    color: var(--oryx-color-neutral-dark);
    box-shadow: var(--oryx-elevation-0) var(--oryx-elevation-color);
    transition: inherit;
    cursor: pointer;
  }

  button:hover {
    background-color: var(--oryx-color-brand);
    color: var(--oryx-color-canvas);
  }

  :host([collapsed]) button oryx-icon {
    transform: rotate(180deg);
  }

  ::slotted(*) {
    text-decoration: none;
  }
`;
