import { css } from 'lit';

export const ProductCardStyles = css`
  :host {
    position: relative;
  }

  content-link {
    display: block;
    color: #333;
    border: 1px solid #dce0e5;
    text-decoration: none;
    border-radius: 2px;
    background-color: var(--oryx-color-canvas);
  }

  content-link::part(wrapper) {
    display: block;
  }

  content-link::part(link) {
    display: block;
    padding: 0;
    border-radius: 0;
    border: none;
  }

  .info {
    flex-grow: 1;
    padding: 0.4375rem;
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    margin: 0.5rem 0;
  }

  .info-col {
    padding: 0 0.5rem;
  }

  .grow1 {
    flex-grow: 1;
    max-width: calc(100% - 1rem);
  }

  product-labels {
    position: absolute;
  }
`;
