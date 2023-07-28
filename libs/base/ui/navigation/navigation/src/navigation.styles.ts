import { css } from 'lit';

export const navigationStyles = css`
  :host {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 250px;
    background-color: var(--oryx-color-neutral-1);
    box-shadow: var(--oryx-elevation-0) var(--oryx-color-elevation);
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
    fill: var(--oryx-color-neutral-12);
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

  oryx-button {
    position: absolute;
    inset-inline-end: -12px;
    inset-block-end: 30px;
  }

  oryx-button::part(button)::before {
    border-color: var(--oryx-color-neutral-8);
  }

  :host([collapsed]) oryx-button {
    transform: rotate(180deg);
  }
`;
