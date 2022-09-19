import { css, unsafeCSS } from 'lit';
import { TabsAppearance } from './tabs.model';

export const tabsStyles = css`
  :host {
    display: flex;
    flex: 1 0 auto;
    overflow-x: scroll;
    scroll-behavior: smooth;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    position: relative;
    cursor: pointer;
  }

  :host([shadow='true']) {
    box-shadow: 0 4px 8px var(--oryx-color-neutral-lighter);
  }

  :host::-webkit-scrollbar {
    display: none;
  }

  .tab-icon {
    margin-inline-end: 5px;
  }

  input[type='range'] {
    width: 0;
    height: 0;
    background: transparent;
    /* stylelint-disable-next-line */
    -webkit-appearance: none;
    position: absolute;
  }

  input[type='range']:focus + ::slotted(oryx-tab[selected]) {
    outline: auto;
  }

  input[type='range']::-webkit-slider-thumb {
    /* stylelint-disable-next-line */
    -webkit-appearance: none;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }

  input[type='range']::-moz-range-thumb {
    border: none;
    background: none;
  }

  :host([appearance='${unsafeCSS(TabsAppearance.Secondary)}'])
    ::slotted(oryx-tab) {
    color: var(--oryx-color-ink);
    background: var(--oryx-color-neutral-lighter);
    border-block-start: 2px solid transparent;
    border-bottom: none;
  }
  @media (max-width: 767px) {
    :host([appearance='${unsafeCSS(TabsAppearance.Secondary)}'])
      ::slotted(oryx-tab) {
      border-width: 4px;
    }
  }

  :host([appearance='${unsafeCSS(TabsAppearance.Secondary)}'])
    ::slotted(oryx-tab:hover) {
    color: var(--oryx-color-ink);
    background: none;
    border-color: var(--oryx-color-neutral-darker);
  }

  :host([appearance='${unsafeCSS(TabsAppearance.Secondary)}'])
    ::slotted(oryx-tab[selected]) {
    color: var(--oryx-color-brand);
    background: none;
    border-color: var(--oryx-color-brand);
    border-bottom: none;
  }

  :host([appearance='${unsafeCSS(TabsAppearance.Secondary)}'])
    ::slotted(oryx-tab[error]) {
    color: var(--oryx-color-error);
    background: var(--oryx-color-neutral-lighter);
    border-color: transparent;
    border-bottom: none;
  }

  :host([appearance='${unsafeCSS(TabsAppearance.Secondary)}'])
    ::slotted(oryx-tab[error]:hover) {
    color: var(--oryx-color-error);
    background: none;
    border-color: var(--oryx-color-neutral-darker);
  }

  :host([appearance='${unsafeCSS(TabsAppearance.Secondary)}'])
    ::slotted(oryx-tab[error][selected]) {
    color: var(--oryx-color-error);
    background: none;
    border-color: var(--oryx-color-error);
    border-bottom: none;
  }
`;
