import { css, unsafeCSS } from 'lit';
import { CollapsibleAppearance } from './collapsible.model';

const blockSelector = unsafeCSS(`[appearance=${CollapsibleAppearance.Block}]`);
const inlineSelector = unsafeCSS(
  `[appearance=${CollapsibleAppearance.Inline}]`
);

const commonStyles = css`
  :host {
    --_radius: var(
      --oryx-collapsible-border-radius,
      var(--oryx-border-radius-small)
    );

    display: block;
  }

  summary {
    border-radius: var(--_radius);
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    gap: 8px;
    align-items: center;
  }

  summary:focus-visible {
    outline: solid 1px var(--oryx-color-focus);
  }
`;

const inlineStyles = css`
  :host(${inlineSelector}) summary {
    pointer-events: none;
  }

  :host(${inlineSelector}) oryx-button {
    pointer-events: all;
  }
`;

const blockStyles = css`
  :host(${blockSelector}) {
    background: var(--oryx-collapsible-background);
    border-radius: var(--_radius);
    border: var(
      --oryx-collapsible-border,
      solid 1px var(--oryx-color-neutral-6)
    );
  }

  :host(${blockSelector}),
  :host(${blockSelector}) summary {
    transition: background-color var(--oryx-transition-time),
      border var(--oryx-transition-time);
  }

  :host(${blockSelector}) summary:hover {
    background: var(--oryx-collapsible-hover);
  }

  :host(${blockSelector}) details[open] summary:not(:focus-visible) {
    border-block-end: var(--oryx-collapsible-divider);
    border-end-start-radius: 0;
    border-end-end-radius: 0;
  }

  :host(${blockSelector}:hover) {
    border: var(
      --oryx-collapsible-border,
      solid 1px var(--oryx-color-neutral-9)
    );
  }

  :host(${blockSelector}) :is(summary, summary + *) {
    padding: 12px;
  }

  :host(${blockSelector}) slot:not([name]) {
    display: block;
  }

  oryx-icon {
    margin-inline-end: -4px;
  }
`;

export const collapsibleStyles = css`
  ${commonStyles}
  ${blockStyles}
  ${inlineStyles}
`;
