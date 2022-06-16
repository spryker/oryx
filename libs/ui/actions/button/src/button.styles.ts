import { css } from 'lit';

export const buttonStyles = css`
  :host {
    --oryx-icon-size: 13.3px;
    --_color-text: var(--oryx-color-canvas);
    --_color-accent: var(--oryx-color-brand);
    --_color-active: var(--oryx-color-brand-dark);

    display: flex;
    align-items: baseline;
    transition: var(--oryx-transition-time);
  }

  ::slotted(:is(button, a)) {
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
    border-radius: var(--oryx-border-radius);
    cursor: pointer;
    transition: var(--oryx-transition-time);
    position: relative;
  }

  :host([size='medium']) {
    --_margin: 8px 19px;
  }

  :host([size='small']) {
    --_margin: 6px 15px;
  }

  :host([size='large'][icon]:not([type='text'])) {
    --_margin: 11px 15px;
  }

  :host([size='medium'][icon]:not([type='text'])) {
    --_margin: 8px 15px;
  }

  :host([size='small'][icon]:not([type='text'])) {
    --_margin: 6px 15px;
  }

  ::slotted(:hover:not(:active)) {
    box-shadow: var(--oryx-elevation-1) var(--oryx-elevation-color);
  }

  ::slotted(:is(button, a):active) {
    background-color: var(--_color-active);
    border-color: var(--_color-active);
  }

  ::slotted(:is(button, a):focus-visible:not(:active):not([disabled])) {
    border-color: var(--oryx-color-canvas);
    box-shadow: 0 0 4px var(--oryx-color-focus);
  }

  :host([outline]) {
    --oryx-icon-color: var(--oryx-color-brand);
    --_color-text: var(--oryx-color-brand);
    --_color-accent: var(--oryx-color-brand);
    --_color-active: var(--oryx-color-neutral-lighter);
  }

  :host([outline]) ::slotted(:is(button, a):not([disabled])) {
    background-color: var(--oryx-color-canvas);
  }

  :host([outline]) ::slotted(:is(button, a):active) {
    border-color: var(--_color-accent);
    background-color: var(--_color-active);
  }

  :host([outline][type='critical']) {
    --oryx-icon-color: var(--oryx-color-error);
    --_color-text: var(--oryx-color-error);
    --_color-accent: var(--oryx-color-error);
    --_color-active: var(--oryx-color-neutral-lighter);
  }

  :host([type='secondary']) {
    --oryx-icon-color: var(--oryx-color-neutral-darker);
    --_color-text: var(--oryx-color-neutral-darker);
    --_color-accent: var(--oryx-color-neutral);
    --_color-active: var(--oryx-color-neutral-lighter);
  }

  :host([type='secondary']) ::slotted(:is(button, a)),
  :host([type='secondary']) ::slotted(:is(button, a):active) {
    border-color: var(--oryx-color-neutral);
  }

  :host([outline])
    ::slotted(:is(button, a):focus-visible:not(:active):not([disabled])) {
    border-color: var(--oryx-color-canvas);
  }

  :host([outline])
    ::slotted(:is(button, a):focus-visible:not(:active):not([disabled]))::before {
    content: '';
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    border: 1px solid var(--_color-accent);
  }

  :host([type='secondary'])
    ::slotted(:is(button, a):focus-visible:not(:active):not([disabled])) {
    border-color: var(--oryx-color-canvas);
  }

  :host([type='critical']) {
    --_color-accent: var(--oryx-color-error);
    --_color-active: var(--oryx-color-error-dark);
  }

  :host([type='text']) ::slotted(:is(button, a)) {
    border-radius: var(--oryx-border-radius-small);
    box-shadow: none;
    line-height: 22px;
    padding: 0 2px;
  }

  :host([type='text']) {
    --_margin: 4px 2px;
    --oryx-icon-color: var(--oryx-color-neutral-dark);
    --_color-text: var(--oryx-color-ink);
    --_color-accent: var(--oryx-color-canvas);
    --_color-active: var(--oryx-color-canvas);
  }

  :host([type='text']) ::slotted(:is(button, a):hover) {
    --oryx-icon-color: var(--oryx-color-brand);
    --_color-text: var(--oryx-color-brand);
  }

  :host([type='text']) ::slotted(:is(button, a):active) {
    --oryx-icon-color: var(--oryx-color-brand-dark);
    --_color-text: var(--oryx-color-brand-dark);
  }

  :host([type='text']) ::slotted([disabled]) {
    --oryx-icon-color: var(--oryx-color-neutral);
    --_color-text: var(--oryx-color-neutral-dark);
    --_color-accent: var(--oryx-color-canvas);
  }

  :host([type='text']:not([loading]))
    ::slotted(:is(button, a):focus-visible:not(:active):not([disabled])) {
    --oryx-icon-color: var(--oryx-color-brand);
    --_color-text: var(--oryx-color-brand);
  }

  ::slotted([disabled]) {
    --oryx-icon-color: var(--oryx-color-neutral-dark);

    position: relative;
    pointer-events: none;

    --_color-text: var(--oryx-color-neutral-dark);
    --_color-accent: var(--oryx-color-neutral-light);
  }

  :host([loading]),
  :host([loading][outline]) {
    --oryx-icon-color: transparent;
  }

  :host([loading]) ::slotted(:is(button, a)) {
    position: relative;
    pointer-events: none;
    background-color: var(--oryx-color-brand-lighter);
    border-color: var(--oryx-color-brand-light);
    color: transparent;
  }

  :host([loading]) ::slotted(:is(button, a))::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 16px;
    background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2317b497"%3E%3Cg%3E%3Cellipse opacity="0.7" rx="3.48584" ry="3.4859" transform="matrix(0.80444 0.594034 -0.593986 0.804475 11.925 4.87503)" /%3E%3Cellipse rx="3.48584" ry="3.4859" transform="matrix(0.80444 0.594034 -0.593986 0.804475 20.1242 10.9278)" /%3E%3Cellipse opacity="0.4" rx="3.48584" ry="3.4859" transform="matrix(0.80444 0.594034 -0.593986 0.804475 5.87224 13.0723)" /%3E%3Cellipse opacity="0.3" rx="3.48584" ry="3.4859" transform="matrix(0.80444 0.594034 -0.593986 0.804475 14.0695 19.125)" /%3E%3CanimateTransform attributeName="transform" type="rotate" from="0 12 12" to="-360 12 12" dur="3s" repeatCount="indefinite" /%3E%3C/g%3E%3C/svg%3E');
  }

  :host([loading][type='text']) ::slotted(:is(button, a)) {
    --oryx-icon-color: transparent;

    color: var(--oryx-color-neutral-dark);
    background-color: transparent;
    border-color: var(--oryx-color-canvas);
  }

  :host([loading][type='text']) ::slotted(:is(button, a))::before {
    position: relative;
    width: 16px;
    height: 16px;
  }

  :host([loading][type='text'][icon]) ::slotted(:is(button, a))::before {
    position: absolute;
    width: 100%;
    height: 100%;
    background-position: left center;
  }

  :host([type='secondary'][loading]) ::slotted(:is(button, a)) {
    background-color: var(--oryx-color-canvas);
    border-color: var(--oryx-color-neutral);
  }

  :host([type='critical'][loading]) ::slotted(:is(button, a))::before {
    background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red"%3E%3Cg%3E%3Cellipse opacity="0.7" rx="3.48584" ry="3.4859" transform="matrix(0.80444 0.594034 -0.593986 0.804475 11.925 4.87503)" /%3E%3Cellipse rx="3.48584" ry="3.4859" transform="matrix(0.80444 0.594034 -0.593986 0.804475 20.1242 10.9278)" /%3E%3Cellipse opacity="0.4" rx="3.48584" ry="3.4859" transform="matrix(0.80444 0.594034 -0.593986 0.804475 5.87224 13.0723)" /%3E%3Cellipse opacity="0.3" rx="3.48584" ry="3.4859" transform="matrix(0.80444 0.594034 -0.593986 0.804475 14.0695 19.125)" /%3E%3CanimateTransform attributeName="transform" type="rotate" from="0 12 12" to="-360 12 12" dur="3s" repeatCount="indefinite" /%3E%3C/g%3E%3C/svg%3E');
  }

  :host([type='critical'][loading]) ::slotted(:is(button, a)) {
    background-color: var(--oryx-color-pink-light);
    border-color: #f9d3ce;
  }

  :host([outline][type='critical'][loading]) ::slotted(:is(button, a)) {
    background-color: var(--oryx-color-canvas);
    border-color: #f9d3ce;
  }
`;
