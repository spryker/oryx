import { screenCss } from '@spryker-oryx/utilities';
import { css } from 'lit';

const fontSize = css`
  :host {
    /* --oryx-action-color-hover: blue; */
  }

  :host(:not([block])) {
    /* display: grid; */
  }

  :host(:not([block])[type='text']) {
    /* display: grid; */
    display: inline-grid;
  }

  :host([size='sm']) {
    --_font-size: var(--oryx-action-small, calc(1rem - 2px));
  }

  :host([size='lg']) {
    --_font-size: var(--oryx-action-large, calc(1rem + 2px));
  }

  :host {
    font-size: var(--_font-size, 1em);
    line-height: 1.5em;
  }

  slot {
  }

  :host([singleLine]) slot {
    display: inline-block;
    width: 100%;
    /* 
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    */
  }
`;

const baseStyles = css`
  :host([state]) {
    pointer-events: none;
  }

  :host(:hover) > *,
  ::slotted(*:hover),
  :host([state='active']) > *,
  :host([active]) ::slotted(*) {
    color: var(--oryx-action-color-hover, var(--_t-h, var(--_t)));
    background: var(--_bg-h, var(--_bg));
    border: var(--_bo-h, var(--_bo));
    box-shadow: var(--oryx-action-shadow-hover);
  }

  :host > *:active,
  ::slotted(*:active),
  :host([state='active']) > *,
  :host([state='active']) > ::slotted(*) {
    color: var(--_t-a, var(--_t));
    background: var(--_bg-a, var(--_bg));
    border: var(--_bo-a, var(--_bo));
    box-shadow: var(
      --oryx-action-shadow-active,
      var(--oryx-action-shadow-hover)
    );
  }

  /* :host([state='active']) > *,
  :host([state='active']) ::slotted,
  :host([active]) > *,
  :host([active]) ::slotted(*),
  :host > *:active,
  ::slotted(*:active) {
    
  } */

  :host([state='disabled']) > *,
  :host([state='disabled']) ::slotted(*),
  button:disabled,
  ::slotted(button:disabled) {
    pointer-events: none;
    background: var(--_bg-d, var(--oryx-color-neutral-6));
    color: var(--_t-d, var(--oryx-color-neutral-9));
    border-color: var(--_bg-d, var(--oryx-color-neutral-6));
  }

  :host > *,
  ::slotted(*) {
    all: unset;

    overflow: hidden;
    display: inline-grid;
    place-items: center;
    align-content: center;
    justify-content: center;
    grid-auto-flow: column;
    gap: var(--oryx-space);
    width: var(--_w, 100%);
    height: var(--_h);
    border: var(--_bo, unset);
    background-color: var(--oryx-action-background, var(--_bg));
    box-shadow: var(--oryx-action-shadow);
    color: var(--_t);
    border-radius: var(--oryx-button-radius, var(--_br, 4px));
    transition: background-color, border, color, box-shadow;
    transition-duration: var(--oryx-transition-time);
    /* text-align: center; */
    cursor: pointer;

    padding: var(--oryx-action-padding, var(--_padding));
    box-sizing: border-box;
    outline: revert;
    outline-offset: var(
      --oryx-action-outline-offset,
      var(--_oo, var(--oryx-space))
    );
  }

  :host([block]) > *,
  :host([block]) ::slotted(*) {
    justify-content: center;
  }

  :host(:is([loading], [confirmed])) {
    pointer-events: none;
  }
`;

const button = css`
  :host([type='button'][cta]) {
    --_t-a: var(--oryx-color-primary-1);
  }

  :host(:is(:not([type]), [type='button'])) {
    --_padding: 0 calc(0.5em + 2px);
    --_h: 2em;
    --_h: calc((1em - 6px) * 4);
  }

  :host(:is(:not([type]), [type='button'])) :is(a, button)[iconOnly] {
    --_padding: 8px;
  }

  :host(:is(:not([type]), [type='button']):not([cta])) {
    --_bo: solid 1px var(--oryx-color-primary-9);
    --_t: var(--oryx-color-primary-9);
    --_bg: var(--oryx-color-neutral-1);
    --_bg-h: var(--oryx-color-primary-2);
    --_bg-a: var(--oryx-color-primary-4);
  }

  :host(:is(:not([type]), [type='button'])[cta]) {
    --_t: var(--oryx-color-primary-0, white);
    --_bg: var(--oryx-color-primary-9);
    --_bg-h: var(--oryx-color-primary-10);
    --_bg-a: var(--oryx-color-primary-11);
    --_bo: solid 1px var(--oryx-color-primary-9);
    --_bo-h: solid 1px var(--oryx-color-primary-10);
    --_bo-a: solid 1px var(--oryx-color-primary-11);
  }
`;

const textStyles = css`
  :host([type='text']) {
    --_t-a: var(--oryx-color-primary-11);
    --_bg-d: none;
    /* --_oo: 0; */
    --_br: 0;

    place-content: start;
  }

  :host([type='text'][cta]) {
    --_t: var(--oryx-color-primary-9);
    --_t-h: var(--oryx-color-primary-10);
  }

  :host([type='text']:not([cta]):hover) button,
  :host([type='text']:not([cta]):hover) ::slotted(button) {
    --_t-h: var(--oryx-color-primary-9);
  }

  :host([type='text']) a slot,
  :host([type='text']) ::slotted(a) {
    text-decoration: var(
      --oryx-action-underline,
      solid underline transparent 1px
    );
    text-underline-offset: var(--oryx-action-underline-offset, 4px);
    transition: text-decoration var(--oryx-transition-time) ease-in-out;
  }

  :host([type='text']:hover) a slot,
  :host([type='text']:hover) ::slotted(a) {
    text-decoration-color: currentColor;
  }

  :host([type='text']) oryx-icon {
    align-self: start;
  }
`;

const iconStyles = css`
  :host([type='icon']) {
    --_bg: var(--oryx-color-neutral-1);
    --_bg-h: var(--oryx-color-neutral-3);
    --_bg-a: var(--_bg-h);
    --_bo: solid transparent 2px;
    --_bo-h: solid var(--oryx-color-neutral-7) 2px;
    --_bo-a: var(--_bo-h);
    --_br: 50%;
    --_w: 2em;
    --_h: 2em;
    --_t: var(--oryx-color-neutral-9);
  }

  :host([type='icon'][cta]) {
    --_t: var(--oryx-color-primary-9);
  }

  :host([type='icon']) oryx-icon {
    place-self: center;
    grid-area: 1 / 1;
  }
`;

const tileStyles = css`
  :host([type='tile']) {
    --oryx-icon-size: 36px;
    --_w: 62px;
    --_h: 72px;
    /* --_padding: calc(var(--oryx-space) * 2); */
    --_bg: var(--oryx-color-primary-9);
    --_t: var(--oryx-color-primary-0, white);

    --_bg-h: var(--oryx-color-primary-10);
    --_bg-a: var(--oryx-color-primary-11);
    --_t-a: var(--oryx-color-primary-1);

    --_oo: 0;
  }

  :host([type='tile']) > *,
  :host([type='tile']) ::slotted(*) {
    grid-auto-flow: row;
    align-items: end;
    align-items: center;
    justify-items: center;
    justify-content: center;
  }

  :host([type='tile']) :is(oryx-icon:not([loader]):not([confirmed]), mark) {
    grid-area: 1/1;
  }

  :host([type='tile']) :is(slot, mark) {
    text-overflow: ellipsis;
    overflow: hidden;
  }

  mark {
    z-index: 1;
    background-color: var(--oryx-color-secondary-9);
    color: var(--oryx-color-secondary-0, white);
    place-self: start end;
    padding-inline: calc(var(--oryx-space) * 1.5);
    line-height: 18px;
    border-radius: 2px;
    font-size: 1rem;
    /* margin-inline-start: 50%; */
    margin-inline-end: -8px;
  }

  :host([type='tile']) slot {
    overflow: hidden;
    max-height: var(--height, 72px);
    display: inline-block;
    line-height: calc(1em + var(--oryx-space));
    max-width: 100%;
  }

  :host([type='tile'][icon]) slot {
    grid-row: 2;
  }

  :host([type='tile']) slot {
    grid-column: 1;
    grid-row: 1;
  }

  :host([type='tile']) oryx-icon ~ slot {
    grid-row: 2;
  }

  :host([type='tile']) oryx-icon:is([loader], [confirmed]) {
    grid-area: 1 / 1 / span 2 / span 2;
  }
`;

const tileStyleSm = css`
  :host([type='tile']) {
    --_h: 42px;
    --_w: 48px;
    --oryx-icon-size: 24px;
  }

  :host([type='tile']) slot {
    display: none;
  }

  :host([type='tile']) oryx-icon {
    place-self: center start;
  }

  :host([type='tile']) mark {
    font-size: 12px;
    margin-block-start: calc(var(--oryx-space) * -2);
    margin-inline-end: calc(var(--oryx-space) * -2);
  }
`;

const actionsStyles = css`
  :is(slot, oryx-icon) {
    transition: opacity var(--oryx-transition-time) ease-in-out;
  }

  /* :host([loading]) :is(slot, oryx-icon:not([loader])),
  :host([confirmed]) :is(slot, oryx-icon:not([confirmed])) {*/

  :host(:is([state='loading'], [state='confirmed']))
    :is(slot, oryx-icon:not([state])) {
    display: inline-block;
    opacity: 0;
  }

  /* oryx-icon:is([loader], [confirmed]) { */
  oryx-icon[state] {
    position: absolute;
    /* place-self: center; */
    /* grid-area: 1 / 1 / span 2 / span 2; */
  }

  :host([state]) oryx-icon[type='cycle'] {
    animation: spin 2.5s infinite linear;
  }

  @keyframes spin {
    100% {
      transform: rotate(-360deg);
    }
  }
`;

export const actionStyles = css`
  ${fontSize}
  ${baseStyles}
  ${button}
  ${textStyles}
  ${iconStyles}
  ${tileStyles}
  ${actionsStyles}


  ::slotted(a) {
    outline: solid 1px red !important;
  }
`;

export const screenStyles = [
  ...screenCss({
    sm: css`
      ${tileStyleSm}
    `,
  }),
];
