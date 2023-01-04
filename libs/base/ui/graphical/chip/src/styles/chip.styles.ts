import { css } from 'lit';

export const chipBaseStyle = css`
  :host {
    display: inline-block;
    padding-inline: 12px;
    line-height: 24px;
    flex-grow: 0;
    flex-shrink: 0;
    height: 24px;
    color: var(--c, var(--oryx-color-neutral-300));
    background-color: var(--bg, var(--oryx-color-canvas-300));
  }

  slot {
    display: block;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  :host([dense]) {
    padding-inline: 7px;
  }
`;
