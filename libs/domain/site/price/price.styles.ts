import { css } from 'lit';

export const priceStyles = css`
  :host([discounted]) {
    color: var(--oryx-color-highlight-9);
  }

  :host([original]) {
    text-decoration: line-through;
  }
`;
