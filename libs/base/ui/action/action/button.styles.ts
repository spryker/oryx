import { Size } from '@spryker-oryx/utilities';
import { css, unsafeCSS } from 'lit';
import { HeadingTag, headingUtil } from '../../structure/heading/src';

const lg = unsafeCSS(`[size=${Size.Lg}]`);
const md = unsafeCSS(`[size=${Size.Md}]`);
const sm = unsafeCSS(`[size=${Size.Sm}]`);

const baseStyles = css`
  :host {
    color: var(--text);
    isolation: isolate;
    ${headingUtil(HeadingTag.Bold)}
  }

  :is(a, button),
  ::slotted(:is(a, button)) {
    all: unset;
    height: var(--height);
    min-width: var(--height);
    padding-inline: var(--padding-inline);
    background: var(--background);
    border: solid 2px var(--border);
    border-radius: 10px;
    gap: var(--icon-gap, 8px);
    box-shadow: var(--shadow);
    box-sizing: border-box;
    text-decoration: none;
    transition: var(--oryx-transition-time);
    cursor: pointer;
    width: 100%;
  }

  :is(a, button),
  ::slotted(:is(a, button)),
  :host([custom]) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :host([custom]:not([icon-only]):not([loading])),
  :host([type='icon'][with-icon]) :is(a, button),
  :host([type='icon'][with-icon]) ::slotted(:is(a, button)) {
    justify-content: start;
  }

  :host(:not([type='icon'])) :focus-visible,
  :host(:not([type='icon'])) ::slotted(:is(button, a):focus-visible),
  :host([type='icon']) :focus-visible:before,
  :host([type='icon']) ::slotted(:is(button, a):focus-visible):before {
    outline: solid 2px blue;
    outline-offset: 2px;
  }
`;

const sizeStyles = css`
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
    --icon-gap: 6px;
  }

  :host([type='icon']) {
    --height: var(--icon-height);
  }

  :host([with-icon]:not([type='icon'])) {
    --padding-inline: var(--p2, 14px);
  }

  :host([icon-only]) {
    --padding-inline: 0;
  }
`;

const colorStyles = css`
  :host(:is([type='solid'], :not([type]))) {
    --text: var(--c0);
    --background: var(--c9);
    --border: var(--c9);
  }

  :host([type='outline']) {
    --text: var(--c9);
    --background: var(--c1);
    --border: var(--c9);
  }

  :host([type='icon']) {
    --text: var(--c9);
    --background: var(--c1);
  }

  :host(:is([type='solid'], :not([type])):active) {
    --background: var(--c10);
    --border: var(--c10);
  }

  :host(:is([type='solid'], :not([type]))[color='neutral']):active {
    --background: var(--oryx-color-neutral-12);
  }

  :host([type='outline']:hover:not(:active)),
  :host([type='outline'][loading]) {
    --background: var(--c3);
  }

  :host([type='outline']:active) {
    --text: var(--c10);
    --border: var(--c10);
    --shadow: 0px 0px 3px 0px var(--oryx-color-primary-9);
  }

  :host(:not([type='icon']):hover:not(:active)) {
    --shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
  }

  :host([type='icon']) :is(button, a),
  :host([type='icon']) ::slotted(:is(button, a)) {
    background: transparent;
  }

  :host([type='icon']:hover) {
    --background: transparent;
    --bc: var(--c8);
  }

  :host([type='icon']:active) {
    --bc: var(--c9);
  }

  :host([type='icon'][with-icon]) :is(button, a):before,
  :host([type='icon'][with-icon]) ::slotted(:is(button, a)):before {
    margin-inline-start: calc(var(--button-icon-margin, 7px) * -1);
  }

  :host([custom][type='icon'][with-icon]) [loader] {
    margin-inline-start: var(--button-icon-margin, 7px);
  }

  :host([type='icon'][with-icon]) {
    --padding-inline: var(--button-icon-margin, 7px);
    --icon-gap: calc(var(--button-icon-margin, 8px) + 8px);
  }

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

  :host(:not([type='icon'])[disabled]),
  :host(:not([type='icon'])) button:disabled {
    --background: var(--oryx-color-neutral-6);
    --border: var(--oryx-color-neutral-6);
    --text: var(--oryx-color-neutral-9);
  }

  :host([type='icon']) button:disabled {
    --text: var(--oryx-color-neutral-8);
  }
`;

const iconStyles = css`
  :host([type='icon']) :is(button, a):before,
  :host([type='icon']) ::slotted(:is(button, a)):before {
    content: '';
    box-sizing: border-box;
    width: var(--icon-height);
    height: var(--icon-height);
    border-radius: 50%;
    position: absolute;
    background: var(--background);
    z-index: -1;
    border: solid 1px var(--bc);
    transition: var(--oryx-transition-time);
  }
`;

const loadingStyles = css`
  :host([loading]) {
    color: transparent;
  }

  [loader] {
    position: absolute;
    color: var(--text);
    animation: spin 2s infinite linear;
  }

  @keyframes spin {
    100% {
      transform: rotate(-360deg);
    }
  }
`;

export const buttonStyles = css`
  ${baseStyles}
  ${sizeStyles}
  ${colorStyles}
  ${iconStyles}
  ${loadingStyles}
`;
