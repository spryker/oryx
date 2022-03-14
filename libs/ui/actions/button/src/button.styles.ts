import { css } from 'lit';

export const buttonStyles = css`
  :host {
    --oryx-icon-size: 13.3px;
    --_color-text: var(--oryx-color-canvas);
    --_color-accent: var(--oryx-color-brand);
    --_color-active: var(--oryx-color-brand-dark);

    display: inline-flex;
    position: relative;
    transition: var(--oryx-transition-time);
  }

  ::slotted(*) {
    all: unset;
    padding: var(--_margin, 11px 26px);
    line-height: 24px;
    color: var(--_color-text);
    background-color: var(--_color-accent);
    border: var(--oryx-border-thin) solid var(--_color-accent);
    border-radius: var(--oryx-border-radius);
    outline: var(--oryx-border-thin) solid transparent;
    outline-offset: -2px;
    cursor: pointer;
    transition: var(--oryx-transition-time);
  }

  :host([size='medium']) {
    --_margin: 8px 19px;
  }
  :host([size='small']) {
    --_margin: 6px 15px;
  }

  ::slotted(:hover:not(:active)) {
    box-shadow: var(--oryx-elevation-1) var(--oryx-elevation-color);
  }

  ::slotted(*:active) {
    background-color: var(--_color-active);
    border-color: var(--_color-active);
  }

  ::slotted(*:focus-within:focus-visible:not(:active)) {
    border-color: var(--oryx-color-canvas);
    box-shadow: 0 0 4px var(--oryx-color-focus);
  }

  :host([outline]) {
    --_color-text: var(--oryx-color-brand);
    --_color-accent: var(--oryx-color-brand);
    --_color-active: var(--oryx-color-neutral-lighter);
  }

  :host([outline]) ::slotted(*:not(:active)) {
    background-color: var(--oryx-color-canvas);
  }

  :host([outline]) ::slotted(*:active) {
    border-color: var(--_color-accent);
  }

  :host([outline][type='critical']) {
    --_color-text: var(--oryx-color-error);
    --_color-accent: var(--oryx-color-error);
    --_color-active: var(--oryx-color-neutral-lighter);
  }

  :host([type='secondary']) {
    --_color-text: var(--oryx-color-neutral-darker);
    --_color-accent: var(--oryx-color-canvas);
    --_color-active: var(--oryx-color-neutral-lighter);
  }

  :host([type='secondary']) ::slotted(*),
  :host([type='secondary']) ::slotted(*:active) {
    border-color: var(--oryx-color-neutral);
  }

  :host([outline]) ::slotted(*:focus-within:focus-visible:not(:active)) {
    outline-color: var(--_color-accent);
  }

  :host([type='secondary'])
    ::slotted(*:focus-within:focus-visible:not(:active)) {
    outline-color: var(--oryx-color-neutral);
  }

  :host([type='critical']) {
    --_color-accent: var(--oryx-color-error);
    --_color-active: var(--oryx-color-error-dark);
  }

  :host([disabled]) {
    --_color-text: var(--oryx-color-neutral-dark);
    --_color-accent: var(--oryx-color-neutral-light);
  }

  oryx-icon + slot::slotted(button) {
    text-indent: 22px;
    padding-inline-start: 16px;
    padding-inline-end: 16px;
  }

  oryx-icon {
    position: absolute;
    height: 100%;
  }

  oryx-icon:not(.loader) {
    width: 13.3px;
    margin-top: auto;
    margin-bottom: auto;
    margin-inline-start: 16.3px;
    color: var(--_color-text, var(--oryx-color-canvas));
  }

  oryx-icon.loader {
    width: 100%;
    margin: auto;
  }

  :host([loading]) ::slotted(*),
  ::slotted([disabled]) {
    pointer-events: none;
  }

  :host([loading]) ::slotted(*) {
    background-color: var(--_bg-loading, var(--oryx-color-brand-lighter));
    border-color: var(--_border-loading, var(--oryx-color-brand-light));
    color: transparent;
  }

  :host([loading]) oryx-icon:not(.loader) {
    color: transparent;
  }
`;
