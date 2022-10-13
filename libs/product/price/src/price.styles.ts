import { css } from 'lit';

export const ProductPriceStyles = css`
  :host {
    display: flex;
    gap: 10px;
    align-items: baseline;
    color: var(--oryx-color-warning);
  }

  [part='original'] {
    position: relative;
    color: var(--oryx-color-neutral-darker);
    font-size: 0.8em;
  }

  [part='original']::before {
    content: '';
    position: absolute;
    top: 50%;
    margin-inline-start: -5%;
    width: 110%;
    border-top: 1.5px solid var(--oryx-color-warning);
    transform: rotate(-10deg);
  }
`;
