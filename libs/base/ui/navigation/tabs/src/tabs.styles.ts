import { featureVersion, screenCss } from '@spryker-oryx/utilities';
import { css, unsafeCSS } from 'lit';
import { TabsAppearance } from './tabs.model';

const secondary = unsafeCSS(TabsAppearance.Secondary);
const shadowCSSVar =
  featureVersion >= '1.3'
    ? unsafeCSS('var(--oryx-shadow-raised) var(--oryx-shadow-color)')
    : unsafeCSS('0 4px 8px var(--oryx-elevation-color-2)');

export const baseStyles = css`
  slot:not([name]) {
    display: flex;
    flex: 1 0 auto;
    overflow-x: auto;
    scroll-behavior: smooth;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    cursor: pointer;
  }

  :host([sticky]) slot:not([name]) {
    position: sticky;
    inset-block-start: var(--sticky-offset, 0);
    z-index: 1;
    background-color: var(--oryx-color-neutral-1);
  }

  slot:not([name])::-webkit-scrollbar {
    display: none;
  }

  :host([shadow]) slot:not([name]) {
    box-shadow: ${shadowCSSVar};
  }

  input[type='range'] {
    width: 0;
    height: 0;
    background: transparent;
    appearance: none;
    position: absolute;
  }

  input[type='range']:focus-visible + ::slotted(oryx-tab[selected]) {
    outline: solid 1px var(--oryx-color-focus);
    outline-offset: -1px;
  }

  input[type='range']::-webkit-slider-thumb {
    appearance: none;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }

  input[type='range']::-moz-range-thumb {
    border: none;
    background: none;
  }

  :host([appearance='${secondary}']) ::slotted(oryx-tab) {
    color: var(--oryx-color-neutral-12);
    background: var(--oryx-color-neutral-3);
    border-block-start: 2px solid transparent;
    border-block-end: none;
  }

  :host([appearance='${secondary}']) ::slotted(oryx-tab:hover) {
    color: var(--oryx-color-neutral-12);
    background: none;
    border-color: var(--oryx-color-neutral-11);
  }

  :host([appearance='${secondary}']) ::slotted(oryx-tab[selected]) {
    color: var(--oryx-color-primary-9);
    background: none;
    border-color: var(--oryx-color-primary-9);
    border-block-end: none;
  }

  :host([appearance='${secondary}']) ::slotted(oryx-tab[error]) {
    color: var(--oryx-color-error-9);
    background: var(--oryx-color-neutral-3);
    border-color: transparent;
    border-block-end: none;
  }

  :host([appearance='${secondary}']) ::slotted(oryx-tab[error]:hover) {
    color: var(--oryx-color-error-9);
    background: none;
    border-color: var(--oryx-color-neutral-11);
  }

  :host([appearance='${secondary}']) ::slotted(oryx-tab[error][selected]) {
    color: var(--oryx-color-error-9);
    background: none;
    border-color: var(--oryx-color-error-9);
    border-block-end: none;
  }

  slot[name='panels'] {
    display: flex;
  }

  slot[name='panels']::slotted(*:not([selected])) {
    display: none;
  }
`;

const smallScreen = css`
  :host([appearance='${secondary}']) ::slotted(oryx-tab) {
    border-width: 4px;
  }
`;

export const screenStyles = screenCss({
  sm: smallScreen,
});
