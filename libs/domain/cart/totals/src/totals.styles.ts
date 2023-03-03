import { css } from 'lit';

export const styles = css`
  h2 {
    margin-block-end: var(--oryx-space-4);
  }

  h2,
  section > * {
    padding-inline: var(--oryx-space-4);
  }

  section {
    display: flex;
    flex-direction: column;
    row-gap: var(--oryx-space-4);
    background-color: var(--oryx-color-canvas-200);
    padding-block: var(--oryx-space-4);
    border-radius: var(--oryx-border-radius-medium);
  }

  section > oryx-heading {
    display: flex;
    justify-content: space-between;
  }

  section > oryx-heading > span {
    text-align: end;
  }

  .summary,
  .summary + oryx-heading {
    padding-block-start: var(--oryx-space-2);
    border-block-start: solid 1px var(--oryx-color-canvas-500);
  }

  small {
    font-size: inherit;
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--oryx-color-neutral-300);
  }

  ul {
    display: grid;
    grid-template-columns: 1fr max-content;
    row-gap: var(--oryx-space-2);
    list-style: none;
    color: var(--oryx-color-neutral-300);
    margin: 0;
  }

  li {
    display: contents;
  }

  oryx-collapsible > ul {
    padding: var(--oryx-space-2) 0 0 0;
  }

  :not(oryx-collapsible) > ul {
    margin-block-start: -10px;
    padding-inline: var(--oryx-space-4);
  }

  .discount oryx-heading[slot='aside'],
  .discounts span:last-child {
    color: var(--oryx-color-highlight-300);
    white-space: nowrap;
  }
`;
