import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    isolation: isolate;
  }

  section {
    display: grid;
    grid-template-columns: 1fr min-content;
  }

  div {
    display: grid;
    grid-template-columns: 1fr min-content;
    align-items: center;
    white-space: initial;
    text-overflow: initial;
    overflow: initial;
  }

  section,
  oryx-radio {
    padding: 12px 16px;
  }

  section [slot='subtext'] {
    grid-column: 1/3;
    justify-self: start;
  }

  oryx-user-address {
    line-height: 1.571em;
  }

  .controls {
    z-index: 1;
    align-self: flex-start;
    margin-inline-start: auto;
  }

  [slot='subtext'] {
    display: flex;
    flex-wrap: wrap;
    padding-block-start: 8px;
    gap: 8px;
  }
`;
