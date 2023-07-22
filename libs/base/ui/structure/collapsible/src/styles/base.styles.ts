import { css, unsafeCSS } from 'lit';
import { CollapsibleAppearance } from '../collapsible.model';

export const blockSelector = unsafeCSS(
  `[appearance=${CollapsibleAppearance.Block}]`
);
export const inlineSelector = unsafeCSS(
  `[appearance=${CollapsibleAppearance.Inline}]`
);

export const collapsibleBaseStyle = css`
  :host {
    display: block;
  }

  :host(${blockSelector}),
  summary,
  :host(${blockSelector}) summary:after {
    border-radius: var(
      --oryx-collapsible-border-radius,
      var(--oryx-border-radius-small)
    );
  }

  :host(${blockSelector}) details[open] summary {
    border-end-start-radius: 0;
    border-end-end-radius: 0;
  }

  summary {
    outline: none;
    display: flex;
    align-items: center;
    gap: 7px;
    cursor: pointer;
    user-select: none;
  }

  :host(${blockSelector}) summary::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  details[open] slot[name='expanded'],
  details:not([open]) slot[name='collapsed'] {
    display: none;
  }

  oryx-button {
    display: flex;
    align-items: center;
    color: var(--oryx-color-neutral-11);
  }

  :host(:not(${inlineSelector})) oryx-button {
    margin-inline-end: -7px;
    margin-inline-start: auto;
    pointer-events: none;
  }

  summary::marker,
  summary::-webkit-details-marker {
    display: none;
  }

  :host(${inlineSelector}) summary {
    pointer-events: none;
  }

  :host(${inlineSelector}) oryx-button {
    pointer-events: all;
  }

  slot[name='aside']::slotted(*) {
    margin-inline-start: auto;
  }
`;
