import { css, unsafeCSS } from 'lit';
import { TabsAppearance } from './tabs.model';

const secondary = unsafeCSS(TabsAppearance.Secondary);

export const tabsStyles = css`
  slot:not([name]) {
    display: flex;
    flex: 1 0 auto;
    overflow-x: auto;
    scroll-behavior: smooth;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    cursor: pointer;
  }

  :host([shadow]) slot:not([name]) {
    box-shadow: 0 4px 8px var(--oryx-color-neutral-lighter);
  }

  :host::-webkit-scrollbar {
    display: none;
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
    color: var(--oryx-color-ink);
    background: var(--oryx-color-neutral-lighter);
    border-block-start: 2px solid transparent;
    border-bottom: none;
  }

  @media (max-width: 767px) {
    :host([appearance='${secondary}']) ::slotted(oryx-tab) {
      border-width: 4px;
    }
  }

  :host([appearance='${secondary}']) ::slotted(oryx-tab:hover) {
    color: var(--oryx-color-ink);
    background: none;
    border-color: var(--oryx-color-neutral-darker);
  }

  :host([appearance='${secondary}']) ::slotted(oryx-tab[selected]) {
    color: var(--oryx-color-brand);
    background: none;
    border-color: var(--oryx-color-brand);
    border-bottom: none;
  }

  :host([appearance='${secondary}']) ::slotted(oryx-tab[error]) {
    color: var(--oryx-color-error);
    background: var(--oryx-color-neutral-lighter);
    border-color: transparent;
    border-bottom: none;
  }

  :host([appearance='${secondary}']) ::slotted(oryx-tab[error]:hover) {
    color: var(--oryx-color-error);
    background: none;
    border-color: var(--oryx-color-neutral-darker);
  }

  :host([appearance='${secondary}']) ::slotted(oryx-tab[error][selected]) {
    color: var(--oryx-color-error);
    background: none;
    border-color: var(--oryx-color-error);
    border-bottom: none;
  }

  slot[name='panels'] {
    display: flex;
    padding-block-start: 20px;
  }

  slot[name='panels']::slotted(*:not([selected])) {
    display: none;
  }
`;
