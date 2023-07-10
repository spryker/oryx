import { Size } from '@spryker-oryx/utilities';
import { css, unsafeCSS } from 'lit';
import { ButtonType } from './action.model';

const lg = unsafeCSS(`[size=${Size.Lg}]`);
const md = unsafeCSS(`[size=${Size.Md}]`);
const sm = unsafeCSS(`[size=${Size.Sm}]`);

const sizeStyle = css`
  :host(:not([size])),
  :host(${lg}) {
    --height: var(--oryx-button-lg-height, 46px);
    --icon-height: 38px;
    --padding-inline: 32px;
    --p2: 18px;
  }

  :host(${md}) {
    --height: var(--oryx-button-md-height, 42px);
    --icon-height: 32px;
    --padding-inline: 18px;
    --ib: 20px;
    --button-icon-margin: 6px;
    --button-icon-gap: 14px;
  }

  :host(${md}[type='icon']) {
    --oryx-icon-size: 20px;
  }

  :host(${sm}) {
    --height: var(--oryx-button-sm-height, 32px);
    --icon-height: 24px;
    --padding-inline: 14px;
    --oryx-icon-size: 16px;
    --ib: 16px;
    --button-icon-margin: 4px;
    --button-icon-gap: 12px;
  }

  :host([type='icon']) {
    --height: var(--icon-height);
  }

  :host([icon]) {
    --padding-inline: 0;
  }

  :host([icon]:not([type='icon'])) button:not([empty]) {
    --padding-inline: var(--p2, 14px);
  }

  button,
  ::slotted(*) {
    height: var(--height);
    min-width: var(--height);
    padding-inline: var(--padding-inline);
  }
`;

const colorStyle = css`
  :host(:is([type='solid'], :not([type]))) {
    --text: var(--c0);
    --background: var(--c9);
    --border: var(--c9);
  }

  :host([type='outline']) {
    --text: var(--c9);
    --background: var(--c0);
    --border: var(--c9);
  }

  :host([type='icon']) {
    --text: var(--c9);
    --background: var(--c0);
  }

  button,
  ::slotted(*) {
    color: var(--text);
    background: var(--background);
    border: solid 2px var(--border);
  }

  [loader] {
    color: var(--text);
  }

  :host(:is([type='solid'], :not([type]))) button:active,
  :host(:is([type='solid'], :not([type]))) ::slotted(*:active) {
    --background: var(--c10);
    --border: var(--c10);
  }

  :host(:is([type='solid'], :not([type]))[color='neutral']) button:active,
  :host(:is([type='solid'], :not([type]))[color='neutral'])
    ::slotted(*:active) {
    --background: var(--oryx-color-neutral-12);
  }

  :host([type='outline']) button:hover:not(:active),
  :host([type='outline']) ::slotted(*:hover:not(:active)),
  :host([type='outline'][loading]) {
    --background: var(--c3);
  }

  :host([type='outline']) button:active {
    --text: var(--c10);
    --border: var(--c10);

    box-shadow: 0px 0px 3px 0px var(--oryx-color-primary-9);
  }

  :host(:not([type='icon'])) button:hover:not(:active),
  :host(:not([type='icon'])) ::slotted(*:hover:not(:active)) {
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
  }

  /* icon */

  :host(:not([type='icon'])[disabled]),
  :host(:not([type='icon'])) button:disabled {
    --background: var(--oryx-color-neutral-6);
    --border: var(--oryx-color-neutral-6);
    --text: var(--oryx-color-neutral-9);
  }

  :host([type='icon']) button:disabled {
    --text: var(--oryx-color-neutral-8);
  }

  /* :host([type='icon']) button:hover,
  :host([type='icon']) ::slotted(*:hover) { */

  :host([type='icon']) button {
    background: transparent;
    /* --background: transparent; */
  }

  :host([type='icon']) button:before,
  :host([type='icon']) ::slotted(*):before {
    content: '';
    width: var(--icon-height);
    height: var(--icon-height);
    border-radius: 50%;
    position: absolute;
    background: var(--background);
    z-index: -1;
    border: solid 1px transparent;
    transition: var(--oryx-transition-time);
    box-sizing: border-box;
  }

  :host([type='icon']) button:not([empty]),
  :host([type='icon']) ::slotted(*) {
    padding-inline-start: var(--button-icon-margin, 7px);
    gap: calc(var(--button-icon-margin, 8px) + 8px);
  }

  :host([type='icon']) button:not([empty]):before,
  /* :host([type='icon']) button oryx-icon, */
  :host([type='icon']) ::slotted(*):before {
    margin-inline-start: calc(var(--button-icon-margin, 7px) * -1);
  }

  :host([type='icon']) button:hover:before,
  :host([type='icon']) ::slotted(*:hover):before {
    --background: transparent;

    border-color: var(--c8);
  }

  :host([type='icon']) button:active,
  :host([type='icon']) ::slotted(*:active) {
    color: red;
  }

  /* neutral */

  :host([type='solid'][color='neutral']) {
    --background: var(--oryx-color-neutral-11);
  }

  :host([type='solid'][color='neutral']) button:active {
    --background: var(--oryx-color-neutral-12);
    --border: var(--oryx-color-neutral-12);
  }

  :host([type='outline'][color='neutral']) {
    --text: var(--oryx-color-neutral-11);
    --border: var(--oryx-color-neutral-8);
  }
`;

const iconStyle = css`
  :host([type=${unsafeCSS(ButtonType.Icon)}]) button[empty],
  :host([type=${unsafeCSS(ButtonType.Icon)}]) ::slotted(*) {
    /* border-radius: 50%; */
  }

  /* :host([type='icon']) oryx-icon:not([loader]) {
    --oryx-icon-size: var(--ib, 24px);

    border-radius: 50%;
    border: solid 1px transparent;
    box-sizing: border-box;
    height: var(--ih);
    width: var(--ih);
    transition: var(--oryx-transition-time);
  } */

  /* :host([type=${unsafeCSS(ButtonType.Icon)}]) button:hover oryx-icon {
    border-color: currentColor;
  } */
`;

const focusStyle = css`
  :host(:not([type='icon'])) button:focus-visible,
  :host(:not([type='icon'])) ::slotted(*:focus-visible),
  :host([type='icon']) button:focus-visible:before,
  :host([type='icon']) ::slotted(*:focus-visible):before {
    outline: solid 2px #0064b4;
    outline-offset: 2px;
  }

  /* :host([type='icon']) button:focus-visible:before,
  :host([type='icon']) ::slotted(*:focus-visible):before {
    outline: solid 1px blue;
    outline-offset: 2px;;
  } */
`;

const loadingStyle = css`
  /* :host([loading]),
  :host([disabled]),
  :host([disabled]) ::slotted(*),
  button:disabled {
    pointer-events: none;
  } */

  oryx-icon[loader] {
    position: absolute;
  }

  /* :host([loading]:not([type='icon'])) button,
  :host([loading][type='icon']) oryx-icon:not([loader]) {
    color: transparent;
  } */

  :host([loading]) button,
  :host([loading]) ::slotted(*) {
    color: transparent;
  }

  oryx-icon[loader] {
    animation: spin 2s infinite linear;
  }

  @keyframes spin {
    100% {
      transform: rotate(-360deg);
    }
  }
`;

export const actionStyles = css`
  :host {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* slot,
  button,
  ::slotted(*) {
    width: 100%;
  } */

  button,
  ::slotted(*) {
    all: unset;
    border-radius: var(--oryx-button-border-radius, 4px);
    box-sizing: border-box;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    display: inline-flex;
    gap: 8px;
    align-items: center;
    justify-content: center;
    line-height: var(--oryx-button-line-height, 14px);
    transition: var(--oryx-transition-time);
    cursor: pointer;

    width: 100%;
    isolation: isolate;
  }

  :host([size='sm']) button {
    gap: 6px;
  }

  :host([type='icon']) button:not([empty]) {
    display: inline-grid;
    grid-template-columns: auto 1fr;
  }

  ${sizeStyle}
  ${iconStyle}
  ${colorStyle} 
  ${focusStyle}
  ${loadingStyle}
`;
