import { css, unsafeCSS } from 'lit';
import { Position } from '../../../../src/utilities/model/common';

export const drawerBaseStyles = css`
  dialog {
    all: unset;
    position: fixed;
    inset: auto;
    inset-block-start: 0;
    height: 100%;
    width: var(--oryx-aside-width, 50%);
    transform: scaleX(var(--oryx-aside-visible, 0));
    transform-origin: left top;
    pointer-events: none;
    overscroll-behavior: none;
    box-sizing: border-box;
    outline: none;
    z-index: inherit;
  }

  form {
    display: flex;
    height: 100%;
    width: 100%;
  }

  slot {
    display: block;
    position: relative;
    width: 100%;
    pointer-events: auto;
    overflow: auto;
    overscroll-behavior: contain;
  }

  dialog[open] {
    --oryx-aside-visible: 1;
  }

  :host(:not([position='${unsafeCSS(Position.END)}'])) dialog {
    inset-inline-start: 0;
  }

  :host([position='${unsafeCSS(Position.END)}']) dialog {
    inset-inline-end: 0;
    transform-origin: right top;
  }

  :host(:not([position='${unsafeCSS(Position.END)}'])) nav {
    order: 1;
  }

  :host([position='${unsafeCSS(Position.END)}']) dialog::before {
    inset-inline-start: auto;
    inset-inline-end: 0;
  }

  :host([maximize]) {
    --oryx-aside-width: 100%;
  }
`;

export const panelBaseStyles = css`
  nav {
    display: flex;
    flex-direction: column;
    pointer-events: auto;
  }

  button {
    all: unset;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  nav > * {
    margin-block-end: 5px;
  }
`;
