import { primaryBase } from '@spryker-oryx/utilities';
import { css } from 'lit';

export const styles = css`
  :host {
    text-align: start;
    margin-block-end: 10px;
    text-decoration: none;
    border: 1px solid var(--oryx-color-canvas-500);
    border-radius: 9px;
    position: relative;
    display: block;
    padding-block: 10px;
    padding-inline-end: 20px;
    padding-inline-start: 38px;
    min-height: 22px;
    cursor: pointer;
  }

  h3::before {
    content: '';
    border-radius: 50%;
    width: 8px;
    height: 8px;
    background: var(--oryx-color-canvas-500);
    position: absolute;
    inset-block-start: 17px;
    inset-inline-start: 20px;
  }

  h3 {
    line-height: 22px;
    text-transform: uppercase;
    font-weight: 500;
    color: var(--oryx-color-ink);
    margin: 0;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  slot[name='content'] {
    color: var(--oryx-color-neutral-400);
    text-transform: none;
    font-size: 14px;
  }

  :host([active]) h3::before {
    background: ${primaryBase};
  }

  :host([active]) h3 {
    color: ${primaryBase};
  }

  :host(:hover) {
    box-shadow: 0 4px 12px var(--oryx-color-elevation-2);
  }

  :host(:focus-visible) {
    outline: none;
    border: 1px solid ${primaryBase};
    box-shadow: 0 0 3px ${primaryBase};
  }
`;
