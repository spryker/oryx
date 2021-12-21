import { css } from 'lit';

export const styles = css`
  :host {
    width: var(--icon-size, 24px);
    height: var(--icon-size, 24px);
  }

  svg {
    fill: currentColor;
    width: var(--icon-size, 24px);
    aspect-ratio: 1 / 1;
  }
`;
