import { screenCss } from '@spryker-oryx/utilities';
import { css } from 'lit';

export const buttonStyles = css`
  :host {
    --oryx-icon-size: var(--oryx-button-icon-lg, 20px);
    --_color-text: var(--oryx-color-primary-0, white);
    --_color-accent: var(--oryx-color-primary-9);
    --_color-active: var(--oryx-color-primary-10);

    display: flex;
    place-content: center;
    place-items: center;
    transition: var(--oryx-transition-time);
  }

  ::slotted(*) {
    all: unset;
    display: flex;
    flex: 100%;
    align-items: center;
    justify-content: center;
    gap: 9px;
    padding: var(--_margin, 11px 26px);
    line-height: 24px;
    color: var(--_color-text);
    background-color: var(--_color-accent);
    border: var(--oryx-border-thin) solid var(--_color-accent);
    border-radius: var(--oryx-border-radius-medium);
    cursor: pointer;
    transition: var(--oryx-transition-time);
    position: relative;
  }

  :host([size='sm']) {
    --_margin: 6px 15px;
    --oryx-icon-size: var(--oryx-button-icon-sm, 20px);
  }

  :host([size='md']) {
    --_margin: 8px 19px;
    --oryx-icon-size: var(--oryx-button-icon-md, 20px);
  }

  :host([size='lg'][icon]:not([type='text'])) {
    --_margin: 11px 15px;
  }

  :host([size='md'][icon]:not([type='text'])) {
    --_margin: 8px 15px;
  }

  :host([size='sm'][icon]:not([type='text'])) {
    --_margin: 6px 15px;
  }

  ::slotted(:hover:not(:active)) {
    box-shadow: var(--oryx-elevation-1) var(--oryx-color-elevation);
  }

  ::slotted(*:active) {
    background-color: var(--_color-active);
    border-color: var(--_color-active);
  }

  ::slotted(*:focus-visible:not(:active):not([disabled])) {
    border-color: var(--oryx-color-neutral-1);
    box-shadow: 0 0 4px var(--oryx-color-focus);
  }

  :host([outline]),
  :host([confirmed]),
  :host([loading]) {
    --oryx-icon-color: var(--oryx-color-primary-9);
    --_color-text: var(--oryx-color-primary-9);
    --_color-accent: var(--oryx-color-primary-9);
    --_color-active: var(--oryx-color-primary-3);
  }

  :host([outline]) ::slotted(*:not([disabled])) {
    background-color: var(--oryx-color-neutral-1);
  }

  :host([outline]) ::slotted(*:active) {
    border-color: var(--_color-accent);
    background-color: var(--_color-active);
  }

  :host([outline][type='critical']:not([confirmed])) {
    --oryx-icon-color: var(--oryx-color-error-9);
    --_color-text: var(--oryx-color-error-9);
    --_color-accent: var(--oryx-color-error-9);
    --_color-active: var(--oryx-color-neutral-3);
  }

  :host([type='secondary']) {
    --oryx-icon-color: var(--oryx-color-neutral-11);
    --_color-text: var(--oryx-color-neutral-11);
    --_color-accent: var(--oryx-color-neutral-8);
    --_color-active: var(--oryx-color-neutral-3);
  }

  :host([type='secondary']) ::slotted(*),
  :host([type='secondary']) ::slotted(*:active) {
    border-color: var(--oryx-color-neutral-8);
  }

  :host([outline]) ::slotted(*:focus-visible:not(:active):not([disabled])) {
    border-color: var(--oryx-color-neutral-1);
  }

  :host([outline])
    ::slotted(*:focus-visible:not(:active):not([disabled]))::before {
    content: '';
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    border: 1px solid var(--_color-accent);
  }

  :host([type='secondary'])
    ::slotted(*:focus-visible:not(:active):not([disabled])) {
    border-color: var(--oryx-color-neutral-1);
  }

  :host([type='critical']) {
    --_color-accent: var(--oryx-color-error-9);
    --_color-active: var(--oryx-color-error-10);
  }

  :host([type='text']) ::slotted(*) {
    border-radius: var(--oryx-border-radius-small);
    box-shadow: none;
    line-height: 22px;
    padding: 0 2px;
  }

  :host([type='text']) {
    --_margin: 4px 2px;
    --_color-text: var(--oryx-color-neutral-12);
    --_color-accent: transparent;
    --_color-active: var(--oryx-color-neutral-1);
  }

  :host([type='text']:not([confirmed])) {
    --oryx-icon-color: var(--oryx-color-neutral-9);
  }

  :host([type='text']) ::slotted(*:hover) {
    --oryx-icon-color: var(--oryx-color-primary-9);
    --_color-text: var(--oryx-color-primary-9);
  }

  :host([type='text']) ::slotted(*:active) {
    --oryx-icon-color: var(--oryx-color-primary-10);
    --_color-text: var(--oryx-color-primary-10);
  }

  :host([type='text']) ::slotted([disabled]) {
    --oryx-icon-color: var(--oryx-color-neutral-8);
    --_color-text: var(--oryx-color-neutral-8);
    --_color-accent: var(--oryx-color-neutral-1);
  }

  :host([type='text']:not([loading]))
    ::slotted(*:focus-visible:not(:active):not([disabled])) {
    --oryx-icon-color: var(--oryx-color-primary-9);
    --_color-text: var(--oryx-color-primary-9);
  }

  ::slotted([disabled]) {
    --oryx-icon-color: var(--oryx-color-neutral-9);
    --_color-text: var(--oryx-color-neutral-9);
    --_color-accent: var(--oryx-color-neutral-6);

    position: relative;
    pointer-events: none;
  }

  :host(:is([loading], [confirmed])) ::slotted(*) {
    --oryx-icon-color: transparent;

    position: relative;
    pointer-events: none;
    background-color: var(--oryx-color-neutral-1);
    border-color: var(--oryx-color-primary-7);
    color: transparent;
    user-select: none;
  }

  :host([confirmed]) ::slotted(*) {
    border-color: var(--oryx-color-primary-7);
  }

  :host(:is([loading], [confirmed])) ::slotted(*)::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 16px;
  }

  :host(:not([loading]):not([confirmed])) oryx-icon {
    display: none;
  }

  oryx-icon {
    position: absolute;
  }

  :host([loading]:not([confirmed])) oryx-icon {
    animation: spin 2s infinite linear;
  }

  @keyframes spin {
    100% {
      transform: rotate(-360deg);
    }
  }

  :host([type='critical']:not([confirmed])) oryx-icon {
    --oryx-icon-color: var(--oryx-color-error-9);
  }

  :host([loading][type='text']) ::slotted(*) {
    --oryx-icon-color: transparent;

    background-color: transparent;
    border-color: var(--oryx-color-neutral-1);
  }

  :host([loading][type='text']) ::slotted(*)::before {
    position: relative;
    width: 16px;
    height: 16px;
  }

  :host([loading][type='text'][icon]) ::slotted(*)::before {
    position: absolute;
    width: 100%;
    height: 100%;
    background-position: left center;
  }

  :host([type='secondary'][loading]) ::slotted(*) {
    background-color: var(--oryx-color-neutral-1);
    border-color: var(--oryx-color-neutral-8);
  }

  :host([type='critical'][loading]) ::slotted(*) {
    background-color: var(--oryx-color-error-3);
    border-color: #f9d3ce;
  }

  :host([outline][type='critical'][loading]) ::slotted(*) {
    background-color: var(--oryx-color-neutral-1);
    border-color: #f9d3ce;
  }
`;

const smallScreen = css`
  :host {
    font-weight: 600;
  }

  :host(:not([type='text'])) {
    font-size: 1.143em;
  }
`;

export const buttonScreenStyles = screenCss({
  sm: smallScreen,
});
