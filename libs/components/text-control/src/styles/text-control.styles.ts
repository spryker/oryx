import { css } from 'lit';

export const textControlStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    margin-bottom: 24px;
    cursor: pointer;
  }

  label {
    display: flex;
    margin-bottom: 8px;
    cursor: inherit;
    font-weight: 400;
    font-size: 12px;
    text-transform: uppercase;
  }

  .control {
    display: flex;
    align-items: stretch;
    position: relative;
    border: solid 2px var(--oryx-color-neutral-light);
    border-radius: var(--oryx-border-radius);
    transition: all var(--oryx-transition-time);
    cursor: pointer;
    color: var(--oryx-color-neutral-dark);
    background-color: var(--oryx-color-canvas);
  }

  .control:hover {
    border-color: var(--oryx-color-neutral);
  }

  .control:focus-within {
    border-color: var(--oryx-color-brand);
    box-shadow: var(--oryx-elevation-0) var(--oryx-color-brand);
    transition: box-shadow, border;
    transition-duration: var(--oryx-transition-time);
  }

  ::slotted(input) {
    width: 100%;
    height: 42px;
    padding: 4px 13px;
    background-color: transparent;
    border: none;
    outline: none;
    color: var(--oryx-color-ink);
  }
`;
