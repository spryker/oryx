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
    padding: var(--oryx-space-2) var(--oryx-space-4);
  }

  section [slot='subtext'] {
    grid-column: 1/3;
    justify-self: start;
  }

  oryx-user-address {
    line-height: 1.571em;
    margin-inline-end: var(--oryx-space-2);
  }

  .controls {
    align-self: flex-start;
    margin-inline-start: auto;
  }

  .controls,
  [slot='subtext'] {
    display: flex;
    gap: 4px;
  }

  [slot='subtext'] {
    padding-block-start: 8px;
  }
`;
