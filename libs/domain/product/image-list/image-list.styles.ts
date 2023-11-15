import { css } from 'lit';

export const productImageListStyles = css`
  :host {
    align-items: var(--align, center);
  }

  :host > * {
    aspect-ratio: 1/1;
    max-height: var(--oryx-grid-item-size, 300px);
    overflow: hidden;
    width: 100%;
    cursor: pointer;
  }

  label {
    border-radius: 10px;
  }

  label:hover {
    background: var(--oryx-color-neutral-3);
  }

  :host input {
    appearance: none;
    visibility: hidden;
    height: 20px;
    margin: -20px 0 0;
  }
`;
