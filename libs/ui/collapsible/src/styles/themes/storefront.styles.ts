import { ThemeData } from '@spryker-oryx/core';
import { css } from 'lit';
import { blockSelector, inlineSelector } from '../base.styles';

const inlineCollapsable = css`
  :host(${inlineSelector}) nav {
    transition-duration: 0.6s;
    transition-property: transform;
  }

  :host(${inlineSelector}) details[open] oryx-icon-button {
    transform: rotate(180deg);
  }

  :host(${inlineSelector}) details[open] oryx-icon-button oryx-icon {
    transform: rotate(180deg);
  }
`;

const blockAppearance = css`
  :host(${blockSelector}) {
    border-radius: var(--oryx-border-radius-small);
    border: solid 1px var(--oryx-color-neutral-light);
    position: relative;
  }

  :host(${blockSelector}) :is(summary, summary + *) {
    padding-inline: 20px;
  }

  :host(${blockSelector}) slot[name='side-dish']::slotted(*) {
    margin-inline-start: 20px;
  }

  :host(${blockSelector}:hover) {
    box-shadow: var(--oryx-elevation-0) var(--oryx-elevation-color);
  }

  :host(${blockSelector}:active) {
    border-color: var(--oryx-color-brand-dark);
  }

  :host(${blockSelector}) summary {
    padding-block: 16px 13px;
  }

  :host(${blockSelector}) summary::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    border-radius: var(--oryx-border-radius-small);
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
  }

  :host(${blockSelector}) slot[name='header'] {
    font-size: 16px;
    font-weight: 600;
  }

  :host(${blockSelector}) slot:not([name]) {
    display: block;
    padding-block: 13px;
  }
`;

export const composableStorefrontUI: ThemeData = {
  styles: [inlineCollapsable, blockAppearance],
};
