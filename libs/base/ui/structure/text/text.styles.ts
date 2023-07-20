import { css } from 'lit';

export const textStyles = css`
  * {
    margin: 0;
    font-size: var(--_fs);
    font-weight: var(--_fw);
    line-height: var(--_lh);
    text-wrap: balance;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  caption {
    display: block;
    text-align: start;
  }

  .subtitle {
    text-transform: uppercase;
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
`;

// caption {
//   /* display: inline-block; */
//   display: contents;
// }

// caption,
// .caption {
//   ${headingUtil(HeadingTag.Caption)}
// }

// .subtitle {
//   ${headingUtil(HeadingTag.Subtitle)}

//   text-transform: uppercase;
// }

// .subtitle-small {
//   ${headingUtil(HeadingTag.SubtitleSmall)}
// }

// small {
//   ${headingUtil(HeadingTag.Small)}
// }

// b {
//   ${headingUtil(HeadingTag.Bold)}
// }
