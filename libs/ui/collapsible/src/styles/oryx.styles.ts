import { css } from 'lit';

export const collapsibleStyle = css`
  details {
    position: relative;
    background: var(--oryx-color-neutral-lighter);
    border-radius: var(--oryx-border-radius-small);
  }

  details[open] summary {
    border-bottom: 1px solid var(--oryx-color-neutral-light);
    border-end-start-radius: 0;
    border-end-end-radius: 0;
  }

  summary {
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    text-transform: uppercase;
    padding-block: 9px;
    padding-inline-start: 20px;
    list-style: none;
    transition: background var(--oryx-transition-time);
    border-radius: var(--oryx-border-radius-small);
    outline: none;
  }

  summary:hover {
    background: var(--oryx-color-neutral-light);
  }

  summary:focus-visible::after {
    content: '';
    position: absolute;
    inset: 0;
    box-shadow: var(--oryx-box-shadow-focus);
    border-radius: var(--oryx-border-radius-small);
    pointer-events: none;
  }

  summary slot:not([name='header']) {
    display: block;
    color: var(--oryx-color-neutral-dark);
    margin-inline: 8.5px;
  }

  summary:hover slot:not([name='header']) {
    color: var(--oryx-color-neutral-darker);
  }

  summary slot[name='header'] {
    display: block;
    padding-block: 4px;
  }

  slot:not([name]) {
    display: block;
    padding-block: 13px;
    padding-inline: 20px;
  }
`;
