import { css } from 'lit';
import { HeadingTag, headingUtil } from '../../structure/heading/src';

const baseStyles = css`
  :host {
    ${headingUtil(HeadingTag.Bold)};

    color: var(--_text-color);
    isolation: isolate;
  }

  :is(a, button),
  ::slotted(:is(a, button)) {
    all: unset;
    height: var(--_height);
    min-width: var(--_height);
    padding-inline: var(--_padding-inline);
    background: var(--_background-color);
    border-radius: var(--oryx-button-border-radius, 4px);
    gap: var(--_gap, 8px);
    box-shadow: var(--_box-shadow);
    box-sizing: border-box;
    text-decoration: none;
    transition: var(--oryx-transition-time);
    cursor: pointer;
  }

  :host(:is([type='solid'], [type='outline'])) :is(a, button),
  :host(:is([type='solid'], [type='outline'])) ::slotted(:is(a, button)) {
    border: solid 2px var(--_border-color);
  }

  :host([block]) > :is(a, button),
  :host([block]) ::slotted(:is(a, button)) {
    width: 100%;
  }

  :is(a, button),
  ::slotted(:is(a, button)),
  :host([custom]) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  :host([custom][has-icon]:not([has-text]):not([loading]):not([confirmed])),
  :host([type='icon'][has-icon][has-text]) :is(a, button),
  :host([type='icon'][has-icon][has-text]) ::slotted(:is(a, button)) {
    justify-content: start;
  }

  :focus-visible,
  ::slotted(:focus-visible) {
    outline: solid 2px blue;
    outline-offset: 2px;
  }
`;

const sizeStyles = css`
  :host(:is(:not([type]), [type='solid'], [type='outline'])) {
    --_icon-padding-inline: var(--oryx-button-icon-padding-inline, 18px);
  }

  :host(:is(:not([size]), [size='lg']):is(:not([type]), [type='solid'], [type='outline'])) {
    --_height: var(--oryx-button-lg-height, 46px);
    --_padding-inline: var(--oryx-button-lg-padding-inline, 32px);
  }

  :host([size='md']:is(:not([type]), [type='solid'], [type='outline'])) {
    --_height: var(--oryx-button-md-height, 42px);
    --_padding-inline: var(--oryx-button-md-padding-inline, 18px);
  }

  :host([size='sm']:not([type='text']):not([type='icon'])) {
    --_height: var(--oryx-button-sm-height, 32px);
    --_padding-inline: var(--oryx-button-sm-padding-inline, 14px);
    --_gap: 6px;
  }

  :host([type='text']) {
    --oryx-button-border-radius: 1em;
    --_padding-inline: 8px;
    --_icon-padding-inline: 8px;
  }

  :host([has-text][has-icon]:is(:not([type]), [type='solid'], [type='outline'])) {
    --_padding-inline: var(--_icon-padding-inline, 14px);
  }

  :host(:is([has-icon]:not([has-text]), [type='none'])) {
    --_padding-inline: 0 !important;
  }
`;

const colorStyles = css`
  :host([type='text']),
  :host([type='outline']),
  :host([type='icon']) {
    --_text-color: var(--_c9, var(--oryx-color-primary-9));
  }

  :host(:is([type='solid'], :not([type]))) {
    --_background-color: var(--_c9, var(--oryx-color-primary-9));
    --_text-color: var(--_c0, var(--oryx-color-primary-0));
  }

  :host(:is([type='solid'], :not([type]))),
  :host([type='outline']) {
    --_border-color: var(--_c9, var(--oryx-color-primary-9));
  }

  :host([type='outline']),
  :host([type='icon']) {
    --_background-color: var(--_c1, var(--oryx-color-primary-1));
  }

  :host(:is([type='solid'], :not([type])):active) {
    --_background-color: var(--_c10, var(--oryx-color-primary-10));
    --_border-color: var(--_c10, var(--oryx-color-primary-10));
  }

  :host(:is([type='solid'], :not([type]))[color='neutral']):active {
    --_background-color: var(
      --oryx-color-neutral-12,
      var(--oryx-color-primary-12)
    );
  }

  :host([type='outline']:hover:not(:active)),
  :host([type='outline'][loading]) {
    --_background-color: var(--_c3, var(--oryx-color-primary-3));
  }

  :host([type='outline']:active),
  :host([type='text']:hover) {
    --_text-color: var(--_c10, var(--oryx-color-primary-10));
  }

  :host([type='outline']:active) {
    --_border-color: var(--_c10, var(--oryx-color-primary-10));
    --_box-shadow: 0 0 3px 0
      var(--oryx-color-primary-9, var(--oryx-color-primary-9));
  }

  :host(:not([type='text']):not([type='icon']):hover:not(:active)) {
    --_box-shadow: 0 4px 8px 0 rgba(0 0 0 / 10%);
  }

  :host([type='text']:active) {
    --_background-color: var(
      --oryx-color-neutral-3,
      var(--oryx-color-primary-3)
    );
  }

  :host([type='icon']:hover) {
    --_border-color: var(--_c7, var(--oryx-color-primary-7));
  }

  :host([type='icon']:active) {
    --_border-color: var(--_c9, var(--oryx-color-primary-9));
  }

  :host([type='solid'][color='neutral']) {
    --_background-color: var(
      --oryx-color-neutral-11,
      var(--oryx-color-primary-11)
    );
  }

  :host([type='solid'][color='neutral']) button:active {
    --_background-color: var(
      --oryx-color-neutral-12,
      var(--oryx-color-primary-12)
    );
    --_border-color: var(--oryx-color-neutral-12, var(--oryx-color-primary-12));
  }

  :host([type='outline'][color='neutral']) {
    --_text-color: var(--oryx-color-neutral-11, var(--oryx-color-primary-11));
    --_border-color: var(--oryx-color-neutral-8, var(--oryx-color-primary-8));
  }

  :host(:not([type='text']):not([type='icon'])[disabled]),
  :host(:not([type='text']):not([type='icon'])) button:disabled {
    --_text-color: var(--oryx-color-neutral-9);
    --_border-color: var(--oryx-color-neutral-6, var(--oryx-color-primary-6));
    --_background-color: var(
      --oryx-color-neutral-6,
      var(--oryx-color-primary-6)
    );
  }

  :host(:is([type='text'], [type='icon'])[disabled]) {
    --_text-color: var(--oryx-color-neutral-8);
  }

  :host([type='icon']) button:disabled {
    --_text-color: var(--oryx-color-neutral-8, var(--oryx-color-primary-8));
  }
`;

const iconStyles = css`
  :host([type='icon'][has-text][has-icon]) :is(button, a),
  :host([type='icon'][has-text][has-icon]) ::slotted(:is(button, a)) {
    background: none;
  }

  :host([type='icon']:not([has-text][has-icon])) :is(button, a),
  :host([type='icon']:not([has-text][has-icon])) ::slotted(:is(button, a)) {
    border-radius: 50%;
  }

  :host([size='lg']) {
    --oryx-icon-size: var(--oryx-button-lg-icon-size, 24px);
  }

  :host([size='md']) {
    --oryx-icon-size: var(--oryx-button-md-icon-size, 24px);
  }

  :host([size='sm']),
  :host([type='text']) {
    --oryx-icon-size: 16px;
  }

  :host([type='icon']:is(:not([size]), [size='lg'])) {
    --_height: 38px;
  }

  :host([type='icon'][size='md']) {
    --oryx-icon-size: 20px;
    --_button-icon-margin: 6px;
    --_height: 32px;
  }

  :host([type='icon'][size='sm']) {
    --_button-icon-margin: 4px;
    --_height: 24px;
  }

  :host([type='icon']) :is(button, a)::before,
  :host([type='icon']) ::slotted(:is(button, a))::before {
    content: '';
    height: var(--_height);
    aspect-ratio: 1/1;
    position: absolute;
    z-index: -1;
    background: var(--_background-color);
    border: solid 1px var(--_border-color);
    border-radius: 50%;
    transition: var(--oryx-transition-time);
  }

  :host([type='icon'][has-text][has-icon]) :is(button, a)::before,
  :host([type='icon'][has-text][has-icon]) ::slotted(:is(button, a))::before {
    margin-inline-start: calc(var(--_button-icon-margin, 7px) * -1 - 1px);
  }

  :host([custom][type='icon'][has-text][has-icon]) [loader] {
    margin-inline-start: var(--_button-icon-margin, 7px);
  }

  :host([type='icon'][has-text][has-icon]) {
    --_padding-inline: var(--_button-icon-margin, 7px);
    --_gap: calc(var(--_button-icon-margin, 8px) + 8px);
  }
`;

const loadingStyles = css`
  :host([confirmed]),
  :host([loading]) {
    color: transparent;
  }

  :host([loading]) [loader] {
    animation: spin 2s infinite linear;
  }

  [confirmed],
  [loader] {
    position: absolute;
    color: var(--_text-color);
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
