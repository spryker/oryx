import { css } from 'lit';

export const contentTextStyles = css`
  :host {
    line-height: 1em;
  }

  :host > * {
    font-size: inherit;
    font-weight: inherit;
    line-height: inherit;
  }
`;
