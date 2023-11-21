import { css } from 'lit';

export const textStyles = css`
  :host {
    display: contents;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  caption,
  small,
  .subtitle,
  .subtitle-small,
  strong {
    display: block;
    text-align: start;
    text-wrap: balance;
    margin: 0;
    font-size: var(--_fs);
    font-weight: var(--_fw);
    line-height: var(--_lh);
  }

  strong {
    display: inline;
  }

  .subtitle {
    text-transform: uppercase;
  }

  p:first-of-type {
    margin-block-start: 0;
  }

  p:last-of-type {
    margin-block-end: 0;
  }

  a {
    text-decoration: none;
    color: currentColor;
  }

  a[href=''],
  a:not([href]) {
    pointer-events: none;
  }

  a[data-color='primary'] {
    color: var(--oryx-color-primary-10);
  }

  a:hover {
    text-decoration: solid underline currentColor 1px;
    text-underline-offset: 5px;
  }

  a:active {
    color: var(--oryx-color-primary-9);
  }

  a:focus-visible {
    outline: solid 1px var(--oryx-color-focus);
    outline-offset: 3px;
  }

  oryx-button a:hover {
    text-decoration: none;
  }
`;
