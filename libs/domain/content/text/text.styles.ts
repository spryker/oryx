import { css } from 'lit';

export const contentTextStyles = css`
  :host {
    line-height: 1em;
    /* font-family: 'Kablammo', sans-serif; */
  }

  :host > * {
    font-size: inherit;
    font-weight: inherit;
    line-height: inherit;
    /* -webkit-background-clip: text;
    -webkit-text-fill-color: transparent; */
    /* background-image: linear-gradient(
      45deg,
      var(--oryx-color-secondary-9),
      var(--oryx-color-primary-9)
    ); */
  }
`;
