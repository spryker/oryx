import { css } from 'lit';
import { HeadingTag, headingUtil } from '../heading/src/';

export const textStyles = css`
  h1 {
    ${headingUtil(HeadingTag.H1)}
  }

  h2 {
    ${headingUtil(HeadingTag.H2)}
  }

  h3 {
    ${headingUtil(HeadingTag.H3)}
  }

  h4 {
    ${headingUtil(HeadingTag.H4)}
  }

  h5 {
    ${headingUtil(HeadingTag.H5)}
  }

  h6 {
    ${headingUtil(HeadingTag.H6)}
  }

  .caption {
    ${headingUtil(HeadingTag.Caption)}
  }

  .subtitle {
    ${headingUtil(HeadingTag.Subtitle)}

    text-transform: uppercase;
  }

  .subtitle-small {
    ${headingUtil(HeadingTag.SubtitleSmall)}
  }

  small {
    ${headingUtil(HeadingTag.Small)}
  }

  b {
    ${headingUtil(HeadingTag.Bold)}
  }

  p:first-child {
    margin-block-start: 0;
  }

  p:last-child {
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

  a[color='primary'] {
    color: var(--oryx-color-primary-10);
  }

  a:hover {
    text-decoration: solid underline var(--oryx-color-primary-9) 1px;
    text-underline-offset: 5px;
  }

  a:active {
    color: var(--oryx-color-primary-9);
    /* stylelint-disable-next-line */
    text-decoration-color: currentColor;
  }

  a:focus-visible {
    outline: solid 1px var(--oryx-color-focus);
    outline-offset: 3px;
  }
`;
