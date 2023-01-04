import { ThemeStylesWithMedia } from '@spryker-oryx/core';
import { mdScreen, smScreen } from '@spryker-oryx/themes/breakpoints';
import { css } from 'lit';

export const buttonStyles = css`
  :host {
    --oryx-icon-size: 13.3px;
    --_color-text: var(--oryx-color-canvas-100);
    --_color-accent: var(--oryx-color-primary-300);
    --_color-active: var(--oryx-color-primary-400);

    display: flex;
    align-items: baseline;
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

  ::slotted(*:active) {
    background-color: var(--_color-active);
    border-color: var(--_color-active);
  }

  ::slotted(*:focus-visible:not(:active):not([disabled])) {
    border-color: var(--oryx-color-canvas-100);
    box-shadow: 0 0 4px var(--oryx-color-focus);
  }

  :host([outline]) {
    --oryx-icon-color: var(--oryx-color-primary-300);
    --_color-text: var(--oryx-color-primary-300);
    --_color-accent: var(--oryx-color-primary-300);
    --_color-active: var(--oryx-color-canvas-200);
  }

  :host([outline]) ::slotted(*:not([disabled])) {
    background-color: var(--oryx-color-canvas-100);
  }

  :host([outline]) ::slotted(*:active) {
    border-color: var(--_color-accent);
    background-color: var(--_color-active);
  }

  :host([outline][type='critical']) {
    --oryx-icon-color: var(--oryx-color-error-300);
    --_color-text: var(--oryx-color-error-300);
    --_color-accent: var(--oryx-color-error-300);
    --_color-active: var(--oryx-color-canvas-200);
  }

  :host([type='secondary']) {
    --oryx-icon-color: var(--oryx-color-neutral-400);
    --_color-text: var(--oryx-color-neutral-400);
    --_color-accent: var(--oryx-color-neutral-200);
    --_color-active: var(--oryx-color-canvas-200);
  }

  :host([type='secondary']) ::slotted(*),
  :host([type='secondary']) ::slotted(*:active) {
    border-color: var(--oryx-color-neutral-200);
  }

  :host([outline]) ::slotted(*:focus-visible:not(:active):not([disabled])) {
    border-color: var(--oryx-color-canvas-100);
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
    border-color: var(--oryx-color-canvas-100);
  }

  :host([type='critical']) {
    --_color-accent: var(--oryx-color-error-300);
    --_color-active: var(--oryx-color-error-400);
  }

  :host([type='text']) ::slotted(*) {
    border-radius: var(--oryx-border-radius-small);
    box-shadow: none;
    line-height: 22px;
    padding: 0 2px;
  }

  :host([type='text']) {
    --_margin: 4px 2px;
    --oryx-icon-color: var(--oryx-color-neutral-300);
    --_color-text: var(--oryx-color-ink);
    --_color-accent: transparent;
    --_color-active: var(--oryx-color-canvas-100);
  }

  :host([type='text']) ::slotted(*:hover) {
    --oryx-icon-color: var(--oryx-color-primary-300);
    --_color-text: var(--oryx-color-primary-300);
  }

  :host([type='text']) ::slotted(*:active) {
    --oryx-icon-color: var(--oryx-color-primary-400);
    --_color-text: var(--oryx-color-primary-400);
  }

  :host([type='text']) ::slotted([disabled]) {
    --oryx-icon-color: var(--oryx-color-neutral-200);
    --_color-text: var(--oryx-color-neutral-200);
    --_color-accent: var(--oryx-color-canvas-100);
  }

  :host([type='text']:not([loading]))
    ::slotted(*:focus-visible:not(:active):not([disabled])) {
    --oryx-icon-color: var(--oryx-color-primary-300);
    --_color-text: var(--oryx-color-primary-300);
  }

  ::slotted([disabled]) {
    --oryx-icon-color: var(--oryx-color-neutral-300);
    --_color-text: var(--oryx-color-neutral-300);
    --_color-accent: var(--oryx-color-canvas-500);

    position: relative;
    pointer-events: none;
  }

  :host(:is([loading], [confirmed])) ::slotted(*) {
    --oryx-icon-color: transparent;

    position: relative;
    pointer-events: none;
    background-color: var(--oryx-color-canvas-100);
    border-color: var(--oryx-color-primary-200);
    color: transparent;
    user-select: none;
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

  :host([loading]) ::slotted(*)::before {
    background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2317b497"%3E%3Cg%3E%3Cellipse opacity="0.7" rx="3.48584" ry="3.4859" transform="matrix(0.80444 0.594034 -0.593986 0.804475 11.925 4.87503)" /%3E%3Cellipse rx="3.48584" ry="3.4859" transform="matrix(0.80444 0.594034 -0.593986 0.804475 20.1242 10.9278)" /%3E%3Cellipse opacity="0.4" rx="3.48584" ry="3.4859" transform="matrix(0.80444 0.594034 -0.593986 0.804475 5.87224 13.0723)" /%3E%3Cellipse opacity="0.3" rx="3.48584" ry="3.4859" transform="matrix(0.80444 0.594034 -0.593986 0.804475 14.0695 19.125)" /%3E%3CanimateTransform attributeName="transform" type="rotate" from="0 12 12" to="-360 12 12" dur="3s" repeatCount="indefinite" /%3E%3C/g%3E%3C/svg%3E');
  }

  :host([confirmed]) ::slotted(*)::before {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2317b497'%3E%3Cpath d='M20.4357 8.37056L10.6396 18.4215C10.2624 18.8065 9.77177 19 9.27917 19C8.78657 19 8.29398 18.8065 7.91876 18.4215L3.56427 13.9538C2.81191 13.1838 2.81191 11.9341 3.56427 11.1622C4.31664 10.3902 5.53274 10.3902 6.2851 11.1622L9.27917 14.2341L17.7149 5.57895C18.4673 4.80702 19.6834 4.80702 20.4357 5.57895C21.1881 6.35089 21.1881 7.59863 20.4357 8.37056Z'/%3E%3C/svg%3E");
  }

  :host([loading][type='text']) ::slotted(*) {
    --oryx-icon-color: transparent;

    color: var(--oryx-color-neutral-300);
    background-color: transparent;
    border-color: var(--oryx-color-canvas-100);
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
    background-color: var(--oryx-color-canvas-100);
    border-color: var(--oryx-color-neutral-200);
  }

  :host([type='critical'][loading]) ::slotted(*)::before {
    background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red"%3E%3Cg%3E%3Cellipse opacity="0.7" rx="3.48584" ry="3.4859" transform="matrix(0.80444 0.594034 -0.593986 0.804475 11.925 4.87503)" /%3E%3Cellipse rx="3.48584" ry="3.4859" transform="matrix(0.80444 0.594034 -0.593986 0.804475 20.1242 10.9278)" /%3E%3Cellipse opacity="0.4" rx="3.48584" ry="3.4859" transform="matrix(0.80444 0.594034 -0.593986 0.804475 5.87224 13.0723)" /%3E%3Cellipse opacity="0.3" rx="3.48584" ry="3.4859" transform="matrix(0.80444 0.594034 -0.593986 0.804475 14.0695 19.125)" /%3E%3CanimateTransform attributeName="transform" type="rotate" from="0 12 12" to="-360 12 12" dur="3s" repeatCount="indefinite" /%3E%3C/g%3E%3C/svg%3E');
  }

  :host([type='critical'][loading]) ::slotted(*) {
    background-color: var(--oryx-color-pink-light);
    border-color: #f9d3ce;
  }

  :host([outline][type='critical'][loading]) ::slotted(*) {
    background-color: var(--oryx-color-canvas-100);
    border-color: #f9d3ce;
  }
`;

const smallScreen = css`
  :host {
    font-size: 1.143em;
    font-weight: 600;
  }
`;

const mediumScreen = css`
  :host {
    font-size: 1em;
    font-weight: var(--oryx-typography-font-weight);
  }
`;

export const buttonScreenStyles: ThemeStylesWithMedia[] = [
  {
    media: smScreen,
    css: smallScreen,
  },
  {
    media: mdScreen,
    css: mediumScreen,
  },
];
