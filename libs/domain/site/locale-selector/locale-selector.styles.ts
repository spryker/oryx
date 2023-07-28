import { css } from 'lit';

export const siteLocaleSelectorStyles = css`
  oryx-button {
    color: inherit;
    text-transform: uppercase;
  }

  oryx-button:is(:hover, :active) {
    background-color: rgba(18, 18, 18, 0.1);
  }
`;
