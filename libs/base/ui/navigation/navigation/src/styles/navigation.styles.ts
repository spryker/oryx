import { css } from 'lit';

export const navigationStyles = css`
  :host {
    background-color: var(--oryx-color-neutral-1);
    box-shadow: var(--oryx-elevation-0) var(--oryx-color-elevation);
    display: flex;
    flex-direction: column;
    position: relative;
    height: 100%;
    width: 250px;
    transition: all var(--oryx-transition-time);
  }

  svg {
    fill: var(--oryx-color-neutral-12);
    margin: 15px;
    width: 120px;
  }

  :host([collapsed]) {
    width: 96px;
    align-items: stretch;
  }

  :host([collapsed]) svg {
    width: 30px;
  }

  ::slotted(a) {
    text-decoration: none;
  }

  button {
    width: 30px;
    aspect-ratio: 1/1;
    border-radius: 100%;
    border: none;
    background-color: var(--oryx-color-neutral-1);
    padding: 0;
    color: var(--oryx-color-neutral-9);
    box-shadow: var(--oryx-elevation-0) var(--oryx-color-elevation);
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    inset-inline-end: -15px;
    inset-block-end: 30px;
    cursor: pointer;
    transition: all var(--oryx-transition-time);
  }

  button:hover {
    background-color: var(--oryx-color-primary-9);
    color: var(--oryx-color-neutral-1);
  }

  :host([collapsed]) button oryx-icon {
    transform: rotate(180deg);
  }
`;
