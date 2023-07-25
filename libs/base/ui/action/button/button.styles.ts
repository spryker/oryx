import { css } from 'lit';

const baseStyles = css`
  :host {
    font-weight: var(--oryx-button-font-weight);
    color: var(--oryx-button-color, var(--_text-color));
    isolation: isolate;
  }

  :is(a, button),
  ::slotted(:is(a, button)) {
    all: unset;
    box-sizing: border-box;
    height: var(--oryx-button-height, var(--_height));
    min-width: var(--oryx-button-height, var(--_height));
    width: 100%;
    background: var(--oryx-button-background, var(--_background-color));
    padding: var(--oryx-button-padding, 0 var(--_padding-inline));
    gap: 8px;
    border-radius: var(--oryx-button-border-radius, 4px);
    box-shadow: var(--_box-shadow);
    text-decoration: none;
    transition: var(--oryx-transition-time);
    cursor: pointer;
    border: var(
      --oryx-button-border,
      solid var(--oryx-button-border-width, 2px)
        var(--_border-color, transparent)
    );
  }

  :host([type='icon']) {
    --oryx-button-border-width: 1px;
    --oryx-button-border-radius: 50%;
  }

  :is(a, button),
  ::slotted(:is(a, button)),
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  :focus-visible,
  ::slotted(:focus-visible) {
    outline: solid 2px var(--oryx-color-focus);
    outline-offset: 2px;
  }
`;

const sizeStyles = css`
  :host([size='lg']) {
    --_factor: calc(6 + var(--oryx-button-size-factor, 0));
  }

  :host([size='md']) {
    --_factor: calc(5 + var(--oryx-button-size-factor, 0));
  }

  :host([size='sm']) {
    --_factor: calc(4 + var(--oryx-button-size-factor, 0));
  }

  :host(:is([type='solid'], [type='outline'])) {
    --_height: var(--oryx-button-height, calc(var(--_factor) * 6px + 12px));
  }

  :host([type='solid']) {
    --oryx-icon-size: var(
      --oryx-solid-button-icon-size,
      calc(var(--_factor) * 4px)
    );
  }

  :host([type='outline']) {
    --oryx-icon-size: var(
      --oryx-outline-button-icon-size,
      calc(var(--_factor) * 4px)
    );
  }

  :host([type='text']) {
    --_height: var(--oryx-button-height, calc(var(--_factor) * 4px + 8px));
    --_padding-inline: 8px;
    --oryx-icon-size: var(
      --oryx-text-button-icon-size,
      calc(var(--_factor) * 4px)
    );
  }

  :host([type='icon']) {
    --_height: var(--oryx-button-height, calc(var(--_factor) * 6px));
    --oryx-icon-size: var(
      --oryx-icon-button-icon-size,
      calc(var(--_factor) * 4px)
    );
  }

  :host(:is([type='solid'], [type='outline']):is(:not([has-text]):not([has-icon]))) {
    --_padding-inline: calc(var(--_factor) * 4px);
  }

  :host(:is([type='solid'], [type='outline'])[has-icon][has-text]) {
    --_padding-inline: 16px;
  }
`;

const colorStyles = css`
  :host(:is(:not([type='icon']):not([color]), [color='primary'])) {
    --_c0: var(--oryx-color-primary-0);
    --_c1: var(--oryx-color-primary-1);
    --_c3: var(--oryx-color-primary-3);
    --_c7: var(--oryx-color-primary-7);
    --_c9: var(--oryx-color-primary-9);
    --_c10: var(--oryx-color-primary-10);
  }

  :host(:is([type='icon']:not([color]), [color='neutral'])) {
    --_c0: var(--oryx-color-neutral-0);
    --_c1: var(--oryx-color-neutral-1);
    --_c3: var(--oryx-color-neutral-3);
    --_c7: var(--oryx-color-neutral-7);
    --_c9: var(--oryx-color-neutral-9);
    --_c10: var(--oryx-color-neutral-10);
  }

  :host([color='error']) {
    --_c0: var(--oryx-color-error-0);
    --_c1: var(--oryx-color-error-1);
    --_c3: var(--oryx-color-error-3);
    --_c7: var(--oryx-color-error-7);
    --_c9: var(--oryx-color-error-9);
    --_c10: var(--oryx-color-error-10);
  }

  :host([type='text']),
  :host([type='outline']),
  :host(:is([type='solid'], :not([type]))[loading]) {
    --_text-color: var(--_c9);
  }

  :host([type='icon']) {
    --_text-color: var(--_c9);
  }

  :host(:is([type='solid'], :not([type]))) {
    --_background-color: var(--_c9);
    --_text-color: var(--_c0);
  }

  :host(:is([type='solid'], :not([type]))),
  :host([type='outline']) {
    --_border-color: var(--_c9);
  }

  :host([type='outline']),
  :host([type='icon']) {
    --_background-color: var(--_c1);
  }

  :host(:is([type='solid'], :not([type])):active) {
    --_background-color: var(--_c10);
    --_border-color: var(--_c10);
  }

  :host(:is([type='solid'], :not([type]))[color='neutral']):active {
    --_background-color: var(--oryx-color-neutral-12);
  }

  :host([type='outline']:hover:not(:active)),
  :host(:is(:not([type]), [type='solid'], [type='outline'])[loading]) {
    --_background-color: var(--_c3);
  }

  :host([type='outline']:active),
  :host([type='text']:hover) {
    --_text-color: var(--_c10);
  }

  :host([type='outline']:active) {
    --_border-color: var(--_c10);
    --_box-shadow: 0 0 3px 0 var(--oryx-color-primary-9);
  }

  :host(:not([type='text']):not([type='icon']):hover:not(:active)) {
    --_box-shadow: 0 4px 8px 0 rgba(0 0 0 / 10%);
  }

  :host([type='text']:active) {
    --_background-color: var(--oryx-color-neutral-3);
  }

  :host([type='icon']:hover) {
    --_border-color: var(--_c7);
    --_background-color: var(--oryx-color-neutral-3);
  }

  :host([type='icon']:active) {
    --_border-color: var(--_c9);
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
    --_border-color: var(--oryx-color-neutral-12);
  }

  :host([type='outline'][color='neutral']) {
    --_text-color: var(--oryx-color-neutral-11);
    --_border-color: var(--oryx-color-neutral-8);
  }

  :host(:not([type='text']):not([type='icon'])[disabled]),
  :host(:not([type='text']):not([type='icon'])) button:disabled {
    --_text-color: var(--oryx-color-neutral-9);
    --_border-color: var(--oryx-color-neutral-6);
    --_background-color: var(
      --oryx-color-neutral-6,
      var(--oryx-color-primary-6)
    );
  }

  :host(:is([type='text'], [type='icon'])[disabled]) {
    --_text-color: var(--oryx-color-neutral-8);
  }

  :host([type='icon']) button:disabled {
    --_text-color: var(--oryx-color-neutral-8);
  }
`;

const loadingStyles = css`
  :host(:is([confirmed], [loading]):not([disabled])) {
    color: transparent;
  }

  [confirmed],
  [loader] {
    position: absolute;
    color: var(--_text-color);
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

export const buttonStyles = css`
  ${baseStyles}
  ${sizeStyles}
  ${colorStyles}
  ${loadingStyles}
`;
