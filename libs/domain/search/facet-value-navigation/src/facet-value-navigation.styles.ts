import { primaryBase } from '@spryker-oryx/utilities';

import { css } from 'lit';

export const FacetControlStyles = css`
  .header {
    display: flex;
    align-items: center;
    flex-grow: 1;
    font-size: 16px;
    font-weight: normal;
  }

  .header oryx-button {
    font-size: 14px;
    margin-inline-start: auto;
  }

  .header oryx-button button,
  .controls button {
    color: ${primaryBase};
  }

  .header oryx-chip {
    margin-inline-start: 10px;
  }

  .controls {
    width: fit-content;
    margin-block-start: 10px;
  }

  .counter {
    padding-inline-start: 10px;
    display: block;
    color: #71747c;
  }

  oryx-collapsible {
    width: 100%;
    border: none;
  }

  oryx-collapsible summary,
  oryx-collapsible slot:not([name]) {
    display: block;
    padding-inline: var(--inline-padding);
    padding-block: var(--block-padding);
  }

  oryx-search {
    margin-block-end: 15px;
  }
`;
