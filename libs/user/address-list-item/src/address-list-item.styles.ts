import { css } from 'lit';

export const styles = css`
  section {
    display: grid;
    grid-template-columns: 1fr max-content;
    align-items: center;
  }

  section,
  oryx-radio::part(label) {
    padding-inline: var(--oryx-space-4);
    padding-block: var(--oryx-space-2);
  }

  section [slot='subtext'] {
    grid-column: 1;
    justify-self: start;
    display: flex;
    gap: 4px;
  }

  section,
  span {
    line-height: 1.571em;
  }

  span {
    white-space: normal;
    flex: 1 0;
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
