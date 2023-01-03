import { css } from 'lit';

export const styles = css`
  section {
    display: grid;
    grid-template-columns: 1fr max-content;
    align-items: center;
  }

  section,
  oryx-radio::part(label) {
    padding: var(--oryx-space-2) var(--oryx-space-4);
  }

  section [slot='subtext'] {
    grid-column: 1;
    justify-self: start;
  }

  oryx-user-address {
    line-height: 1.571em;
  }

  .controls {
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
