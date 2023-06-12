import { css } from 'lit';
import { blockSelector, inlineSelector } from '../base.styles';

const inlineAppearance = css`
  :host(${inlineSelector}) :is(oryx-icon-button, oryx-button) {
    transition-duration: 0.6s;
    transition-property: transform;
  }

  :host(${inlineSelector}) details[open] oryx-icon-button {
    transform: rotate(-180deg);
  }

  :host(${inlineSelector}) details[open] oryx-icon-button oryx-icon {
    transform: rotate(-180deg);
  }
`;

const blockAppearance = css`
  :host(${blockSelector}) {
    border: solid 1px var(--oryx-color-neutral-6);
    position: relative;
  }

  :host(${blockSelector}) :is(summary, summary + *) {
    padding-inline: 20px;
  }

  :host(${blockSelector}) slot[name='side-dish']::slotted(*) {
    margin-inline-start: 20px;
  }

  :host(${blockSelector}:hover) {
    box-shadow: var(--oryx-elevation-0) var(--oryx-color-elevation);
  }

  :host(${blockSelector}:active) {
    border-color: var(--oryx-color-primary-10);
  }

  :host(${blockSelector}) summary {
    padding-block: 12px;
  }

  /*
    We isolate this style for both inline/block since "storybook-addon-pseudo-states"
    doesn't support us otherwise.
  */
  summary:focus-visible::after {
    box-shadow: var(--oryx-box-shadow-focus);
  }

  :host(${blockSelector}) oryx-icon-button {
    color: var(--oryx-color-ink);
    position: relative;
    inset-inline-start: 8px;
  }

  :host(${blockSelector}) slot[name='header'] {
    font-size: 16px;
    font-weight: 600;
  }

  :host(${blockSelector}) slot:not([name]) {
    display: block;
    padding-block: 12px;
  }
`;

export const collapsibleStorefrontUI = {
  styles: [inlineAppearance, blockAppearance],
};
