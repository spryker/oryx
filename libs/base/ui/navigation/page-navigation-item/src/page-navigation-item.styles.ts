import { css } from 'lit';

export const styles = css`
  :host {
    text-align: start;
    margin-block-end: 10px;
    text-decoration: none;
    border: 1px solid var(--oryx-color-neutral-6);
    border-radius: 9px;
    position: relative;
    display: block;
    padding-block: 10px;
    padding-inline: 38px 20px;
    min-height: 22px;
    cursor: pointer;
  }

  h3::before {
    content: '';
    border-radius: 50%;
    width: 8px;
    height: 8px;
    background: var(--oryx-color-neutral-6);
    position: absolute;
    inset-block-start: 17px;
    inset-inline-start: 20px;
  }

  h3 {
    line-height: 22px;
    text-transform: uppercase;
    font-weight: 500;
    color: var(--oryx-color-neutral-12);
    margin: 0;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  slot[name='content'] {
    color: var(--oryx-color-neutral-11);
    text-transform: none;
    font-size: 14px;
  }

  :host([active]) h3::before {
    background: var(--oryx-color-primary-9);
  }

  :host([active]) h3 {
    color: var(--oryx-color-primary-9);
  }

  :host(:hover) {
    box-shadow: 0 4px 12px var(--oryx-color-elevation-2);
  }

  :host(:focus-visible) {
    outline: none;
    border: 1px solid var(--oryx-color-primary-9);
    box-shadow: 0 0 3px var(--oryx-color-primary-9);
  }
`;
