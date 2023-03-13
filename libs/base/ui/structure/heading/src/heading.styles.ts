import { ThemeStylesWithMedia } from '@spryker-oryx/core';
import { mdScreen, smScreen } from '@spryker-oryx/themes/breakpoints';
import { css, CSSResult, CSSResultGroup, unsafeCSS } from 'lit';

const unsafe = (value: string): CSSResult => unsafeCSS(value);
/**
 * Generates the CSS selectors and rules for the given tag to plain heading selectors
 * as well as mimic headings with an appearance. The style rules depend on CSS variables
 * for the size, weight and line-height.
 */
const headingStyle = (
  tag: string,
  size: string,
  lineHeight: string,
  weight = 600
): CSSResultGroup => {
  const selector = unsafe(tag);
  const tokenPrefix = unsafe(`--oryx-typography-${tag.split('.').join('')}`);

  return css`
    :host(:not(:is([appearance], [md-appearance], [sm-appearance])))
      ${selector},
      :host(:not(:is([appearance], [md-appearance], [sm-appearance])))
      ::slotted(${selector}),
    :host([appearance='${selector}']) {
      --_line-height: var(${tokenPrefix}-line, ${unsafe(lineHeight)});

      font-size: var(${tokenPrefix}-size, ${unsafe(size)});
      font-weight: var(${tokenPrefix}-weight, ${weight});
    }
  `;
};

const screenSizeHeadingStyle = (
  screenSize: string,
  tag: string,
  size: string,
  lineHeight: string,
  weight = 600
): CSSResultGroup => {
  const appearanceSelector = unsafe(`${screenSize}-appearance`);
  const selector = unsafe(tag);
  const tokenPrefix = unsafe(`--oryx-typography-${tag.split('.').join('')}`);
  return css`
    ${headingStyle(tag, size, lineHeight, weight)}
    :host([${appearanceSelector}='${selector}']) {
      --_line-height: var(${tokenPrefix}-line, ${unsafe(lineHeight)});

      font-size: var(${tokenPrefix}-size, ${unsafe(size)});
      font-weight: var(${tokenPrefix}-weight, ${weight});
    }
  `;
};

/**
 * Font size, weight and line can be configured by CSS variables in a theme. The variables are
 * not set by default.
 *
 * The variables are used in _internal_ variables (  `--_fw` and `--_line-height`), which are not
 * meant as a public API.
 */
export const headlineStyles = css`
  :host,
  :not(slot, style),
  ::slotted(:is(h1, h2, h3, h4, h5, h6, .caption, .subtitle)) {
    margin-block: 0;
    line-height: var(--_line-height);
    max-height: calc(var(--_line-height) * var(--max-lines));
    transition: max-height 2s;
    /* stylelint-disable-next-line */
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: var(--max-lines);
    -webkit-box-orient: vertical;
  }

  :host([appearance]) *,
  :host([appearance])
    ::slotted(:is(h1, h2, h3, h4, h5, h6, .caption, .subtitle)) {
    font-size: inherit;
    line-height: inherit;
    font-weight: inherit;
  }

  .subtitle,
  ::slotted(.subtitle),
  :host([appearance='subtitle']) {
    text-transform: uppercase;
  }

  ${headingStyle('h1', `2.857em`, `1.2em`)}
  ${headingStyle('h2', `2.143em`, `1.2em`)}
  ${headingStyle('h3', `1.572em`, `1.364em`, 500)}
  ${headingStyle('h4', `1.286em`, `1.444em`, 500)}
  ${headingStyle('h5', `1.143em`, `1.5em`)}
  ${headingStyle('h6', `1.143em`, `1.5em`, 500)}
  ${headingStyle('.subtitle', `0.857em`, `1.333em`)}
  ${headingStyle('.caption', `0.857em`, `1.333em`)}
`;

const mediumScreen = css`
  :host([md-appearance]) *:not(slot, style),
  :host([md-appearance])
    ::slotted(:is(h1, h2, h3, h4, h5, h6, .caption, .subtitle, span)) {
    font-size: inherit;
    line-height: inherit;
    font-weight: inherit;
  }

  :host([md-appearance='subtitle']) {
    text-transform: uppercase;
  }

  :host(:not([md-appearance='subtitle'])) {
    text-transform: initial;
  }

  ${screenSizeHeadingStyle('md', 'h1', `2.857em`, `1.2em`)}
  ${screenSizeHeadingStyle('md', 'h2', `2.143em`, `1.2em`)}
  ${screenSizeHeadingStyle('md', 'h3', `1.571em`, `1.364em`, 500)}
  ${screenSizeHeadingStyle('md', 'h4', `1.286em`, `1.444em`, 500)}
  ${screenSizeHeadingStyle('md', 'h5', `1.143em`, `1.5em`)}
  ${screenSizeHeadingStyle('md', 'h6', `1.143em`, `1.5em`, 500)}
  ${screenSizeHeadingStyle('md', '.subtitle', `0.857em`, `1.333em`)}
  ${screenSizeHeadingStyle('md', '.caption', `0.857em`, `1.333em`)}
`;

const smallScreen = css`
  :host([sm-appearance]) *:not(slot, style),
  :host([sm-appearance])
    ::slotted(:is(h1, h2, h3, h4, h5, h6, .caption, .subtitle, span)) {
    font-size: inherit;
    line-height: inherit;
    font-weight: inherit;
  }

  :host([sm-appearance='subtitle']) {
    text-transform: uppercase;
  }

  :host(:not([sm-appearance='subtitle'])) {
    text-transform: initial;
  }

  ${screenSizeHeadingStyle('sm', 'h1', `1.572em`, `1.364em`)}
  ${screenSizeHeadingStyle('sm', 'h2', `1.286em`, `1.44em`, 700)}
  ${screenSizeHeadingStyle('sm', 'h3', `1.143em`, `1.375em`)}
  ${screenSizeHeadingStyle('sm', 'h4', `1em`, `1.572em`)}
  ${screenSizeHeadingStyle('sm', 'h5', `1em`, `1.572em`, 700)}
  ${screenSizeHeadingStyle('sm', 'h6', `0.857em`, `1.333em`)}
  ${screenSizeHeadingStyle('sm', '.subtitle', `0.857em`, `1.333em`)}
  ${screenSizeHeadingStyle('sm', '.caption', `0.857em`, `1.333em`)}
`;

/**
 * Headline styles are by default based on the global font-size
 * definition for small screens, using the _em_ unit. The line-height
 * is also setup relatively, but relative to the font-size of the element,
 * using _em_ unit.
 *
 * Each definition can be controlled with a CSS variable.
 */
export const headlineScreenStyles: ThemeStylesWithMedia[] = [
  {
    media: mdScreen,
    css: mediumScreen,
  },
  {
    media: smScreen,
    css: smallScreen,
  },
];
