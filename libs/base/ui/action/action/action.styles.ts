import { screenCss } from '@spryker-oryx/utilities';
import { css } from 'lit';

const baseStyles = css`
  :host {
    --oryx-space: 4px;
  }

  :host(:is([type='solid'], [type='tile'], :not([type]))) {
    --_b: var(--_c9, var(--oryx-color-primary-9));
    --_t: var(--_c0, var(--oryx-color-primary-0, white));
  }

  :is(a, button),
  ::slotted(:is(a, button)) {
    all: unset;

    width: var(--_w);
    height: var(--_h);
    border: unset;
    font: inherit;
    background-color: var(--_b);
    color: var(--_t);
    border-radius: var(--oryx-button-radius, 4px);
    transition: background-color var(--oryx-transition-time) ease-in-out,
      color var(--oryx-transition-time) ease-in-out;
    cursor: pointer;
    display: inline-grid;
    text-decoration: none;
    padding: var(--_p);
  }

  :host(:hover) {
    --_b: var(--_c10, var(--oryx-color-primary-10));
  }

  :host :is(a, button):active,
  ::slotted(:is(a, button):active) {
    --_b: var(--_c11, var(--oryx-color-primary-11));
    --_t: var(--_c1, var(--oryx-color-primary-1));
  }

  :host([disabled]),
  ::slotted(:is(a, button):disabled) {
    --_b: var(--oryx-color-neutral-6);
    --_t: var(--oryx-color-neutral-8);
  }

  :is(button, a):focus-visible {
    outline: revert;
  }
`;

const tileStyles = css`
  :host(:is([type='tile'])) {
    --_w: 62px;
    --_h: 72px;
    --oryx-icon-size: 36px;
    --_p: calc(var(--oryx-space) * 2);
  }

  :host(:is([type='tile'])) :is(a, button),
  :host(:is([type='tile'])) ::slotted(:is(a, button)) {
    /* grid-template-rows: 1fr 1fr; */
    align-items: end;
    align-items: center;
    justify-items: center;
    box-sizing: border-box;
  }

  oryx-icon,
  mark {
    grid-column: 1;
    grid-row: 1;
  }

  slot,
  mark {
    text-overflow: ellipsis;
    overflow: hidden;
  }

  mark {
    z-index: 1;
    background-color: var(--oryx-color-secondary-9);
    color: var(--oryx-color-secondary-0, white);
    place-self: start center;
    padding-inline: calc(var(--oryx-space) * 1.5);
    line-height: 18px;
    border-radius: 2px;
    font-size: 1rem;
    margin-inline-start: 50%;
  }

  slot {
    overflow: hidden;
    max-height: var(--height, 72px);
    display: inline-block;
    line-height: calc(1em + var(--oryx-space));
    max-width: 100%;
  }

  :host([type='tile'][icon]) slot {
    grid-row: 2;
  }

  slot {
    grid-column: 1;
    grid-row: 1;
  }

  oryx-icon ~ slot {
    grid-row: 2;
  }
`;

const actionsStyles = css`
  :is(slot, oryx-icon) {
    transition: opacity var(--oryx-transition-time) ease-in-out;
  }

  :host([loading]) :is(slot, oryx-icon:not([loader])),
  :host([confirmed]) :is(slot, oryx-icon:not([confirmed])) {
    opacity: 0;
  }

  oryx-icon:is([loader], [confirmed]) {
    place-self: center;
    grid-row: 1 / span 2;
  }

  :host([loading]) [loader] {
    animation: spin 2.5s infinite linear;
  }

  @keyframes spin {
    100% {
      transform: rotate(-360deg);
    }
  }
`;

export const actionStyles = css`
  ${baseStyles}
  ${tileStyles}
  ${actionsStyles}
`;

const smallScreen = css`
  :host([type='tile']) {
    --_h: 42px;
    --_w: 48px;
    --oryx-icon-size: 24px;
  }

  :host([type='tile']) slot {
    display: none;
  }

  oryx-icon {
    place-self: center start;
  }

  mark {
    font-size: 12px;
    margin-block-start: calc(var(--oryx-space) * -2);
    margin-inline-end: calc(var(--oryx-space) * -2);
  }
`;

export const screenStyles = [
  ...screenCss({
    sm: smallScreen,
  }),
];
