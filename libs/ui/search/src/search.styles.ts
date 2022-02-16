import { css } from 'lit';

export const searchStyles = css`
  button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: inherit;
    transition: opacity var(--oryx-transition-time, 0.3s);
    padding: 0;
  }

  button[disabled] {
    cursor: default;
  }

  button:not([disabled]):hover {
    color: var(--oryx-color-neutral-darker);
  }

  button.clear {
    opacity: 0%;
    z-index: 1;
  }

  :host(.has-value) button.clear:not([appearance='HOVER']),
  :host(.has-value) button.clear[appearance='HOVER']:hover {
    opacity: 100%;
  }

  button.clear:not([appearance='SHOW']) + button.search {
    position: absolute;
  }

  :host(.has-value) button.clear[appearance='TOGGLE'] + button.search,
  :host(.has-value) button.clear[appearance='HOVER']:hover + button.search {
    opacity: 0%;
  }
`;
