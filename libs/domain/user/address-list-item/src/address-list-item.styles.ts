import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
  }

  section {
    display: grid;
    grid-template-columns: 1fr max-content;
    align-items: center;
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
    margin-inline-end: 8px;
  }

  .controls {
    align-self: flex-start;
    margin-inline-start: auto;
  }

  .controls,
  [slot='subtext'] {
    display: flex;
    gap: 8px;
  }

  [slot='subtext'] {
    padding-block-start: 8px;
  }
`;
