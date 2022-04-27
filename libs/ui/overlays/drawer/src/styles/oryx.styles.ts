import { css, unsafeCSS } from 'lit';
import { Position } from '../../../../utilities/model/common';
import { DrawerType } from '../drawer.model';

export const drawerStyles = css`
  :host(:not([not-closable][not-resizable])) {
    --_drawer-panel-size: 48px;
  }

  dialog {
    transition-property: transform, width;
    transition-duration: var(--oryx-transition-time);
  }

  dialog::before {
    content: '';
    position: absolute;
    top: 0;
    inset-inline-start: 0;
    width: calc(100% - var(--_drawer-panel-size, 0px));
    height: 100%;
    z-index: 0;
    box-shadow: var(--oryx-elevation-3) var(--oryx-elevation-color-2);
    background: var(--oryx-color-neutral-lighter);
  }

  :host([type='${unsafeCSS(DrawerType.SECONDARY)}']) dialog::before {
    background: var(--oryx-color-canvas);
  }
`;

export const panelStyles = css`
  nav {
    --oryx-icon-size: var(--oryx-icon-size-small);

    padding-top: 20px;
  }

  button {
    width: var(--_drawer-panel-size);
    height: var(--_drawer-panel-size);
    background: var(--oryx-color-canvas);
    color: var(--oryx-color-neutral-dark);
    transition: color, background var(--oryx-transition-time);
    box-sizing: border-box;
  }

  button:hover {
    color: var(--oryx-color-canvas);
    background: var(--oryx-color-brand);
  }

  button:is(:focus-visible, :focus) {
    border: 1px solid var(--oryx-color-brand);
  }

  button::before {
    content: '';
    position: absolute;
    z-index: -1;
    inset: 0;
    box-shadow: var(--oryx-elevation-3) var(--oryx-elevation-color-2);
  }

  :host(:not([position='${unsafeCSS(Position.END)}'])) button,
  :host(:not([position='${unsafeCSS(Position.END)}'])) button::before {
    border-start-end-radius: var(--oryx-border-radius);
    border-end-end-radius: var(--oryx-border-radius);
  }

  :host([position='${unsafeCSS(Position.END)}']) button,
  :host([position='${unsafeCSS(Position.END)}']) button::before {
    border-start-start-radius: var(--oryx-border-radius);
    border-end-start-radius: var(--oryx-border-radius);
  }
`;
