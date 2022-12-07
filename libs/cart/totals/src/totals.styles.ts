import { css } from 'lit';

export const styles = css`
  :host {
    --oryx-icon-size-small: 15px;
  }

  h2 {
    margin-bottom: var(--oryx-space-4);
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
    border-radius: var(--oryx-border-radius-small);
  }

  section > oryx-heading {
    display: flex;
    justify-content: space-between;
  }

  section > oryx-heading > span {
    text-align: end;
  }

  .items {
    margin-inline: 10px;
    color: var(--oryx-color-neutral-300);
  }

  .items::before {
    content: '(';
    margin-inline-end: -2px;
  }

  .items::after {
    content: ')';
    margin-inline-start: -2px;
  }

  .summary,
  .summary + oryx-heading {
    padding-top: var(--oryx-space-2);
    border-top: solid 1px var(--oryx-color-canvas-500);
  }

  small {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--oryx-color-neutral-300);
  }

  small.tax-message {
    font-size: var(--oryx-font-size-medium);
    font-weight: 500;
    display: block;
  }

  ul {
    display: grid;
    grid-template-columns: 1fr max-content;
    row-gap: var(--oryx-space-2);
    list-style: none;
    padding: var(--oryx-space-2) 0 0 0;
    color: var(--oryx-color-neutral-300);
    margin: 0;
  }

  li {
    display: contents;
  }

  .discounts oryx-heading[slot='aside'],
  .discounts span:last-child {
    color: var(--oryx-color-highlight-300);
    white-space: nowrap;
  }
`;
