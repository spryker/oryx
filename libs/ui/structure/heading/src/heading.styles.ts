import { ThemeStylesWithMedia } from '@spryker-oryx/core';
import { mdScreen } from '@spryker-oryx/themes/breakpoints';
import { css, CSSResult, CSSResultGroup, unsafeCSS } from 'lit';

const unsafe = (value: string): CSSResult => unsafeCSS(value);
/**
 * Generates the CSS selectors and rules for the given tag to plain heading selectors
 * as well as mimic headings with an appearance. The style rules depend on CSS variables
 * for the size, weight and line-height. To have a more efficient setup, we use internal
 * css variables to accommodate styles in the various headings:
 *
 * ```css
 * h1 {
 *   --_fs: var(--oryx-typography-h1-size, 2rem);
 *   --_lh: var(--oryx-typography-h1-line, 1.2em);
 *   --_fw: var(--oryx-typography-h1-weight, 500);
 * }
 * ```
 */
const headingStyle = (
  tag: string,
  size: string,
  lineHeight: string,
  weight = 600
): CSSResultGroup => {
  const selector = unsafe(tag);
  return css`
    :host(:not(:is([appearance], [md-appearance])))
      ${selector},
      :host(:not(:is([appearance], [md-appearance])))
      ::slotted(${selector}),
    :host([appearance='${selector}']) {
      font-size: var(--oryx-typography-${selector}-size, ${unsafe(size)});
      line-height: var(
        --oryx-typography-${selector}-line,
        ${unsafe(lineHeight)}
      );
      font-weight: var(--oryx-typography-${selector}-weight, ${weight});
    }
  `;
};

const headingStyleForMedium = (
  tag: string,
  size: string,
  lineHeight: string,
  weight = 600
): CSSResultGroup => {
  const selector = unsafe(tag);
  return css`
    ${headingStyle(tag, size, lineHeight, weight)}
    :host([md-appearance='${selector}']) {
      font-size: var(--oryx-typography-${selector}-size, ${unsafe(size)});
      line-height: var(
        --oryx-typography-${selector}-line,
        ${unsafe(lineHeight)}
      );
      font-weight: var(--oryx-typography-${selector}-weight, ${weight});
    }
  `;
};

/**
 * Font size, weight and line can be configured by CSS variables in a theme. The variables are
 * not set by default.
 *
 * The variables are used in _internal_ variables ( `--_fs`, `--_fw` and `--_lh`), which are not
 * meant as a public API.
 */
export const headlineStyles = css`
  :host,
  :not(slot, style),
  ::slotted(:is(h1, h2, h3, h4, h5, h6, .subtitle)) {
    margin-block: 0;
    max-height: calc(var(--_lh) * var(--max-lines));
    /* stylelint-disable-next-line */
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: var(--max-lines);
    -webkit-box-orient: vertical;
  }

  :host([appearance]) *,
  :host([appearance]) ::slotted(:is(h1, h2, h3, h4, h5, h6, .subtitle)) {
    font-size: inherit;
    line-height: inherit;
    font-weight: inherit;
  }

  .subtitle,
  ::slotted(.subtitle),
  :host([appearance='subtitle']) {
    text-transform: uppercase;
  }

  ${headingStyle('h1', `1.571em`, `1.364em`)}
  ${headingStyle('h2', `1.286em`, `1.444em`, 700)}
  ${headingStyle('h3', `1.143em`, `1.375em`)}
  ${headingStyle('h4', `1em`, `1.571em`)}
  ${headingStyle('h5', `1em`, `1.571em`, 700)}
  ${headingStyle('h6', `0.857em`, `1.333em`)}
  ${headingStyle('.subtitle', `0.857em`, `1.333em`)}
`;

const mediumScreen = css`
  :host([md-appearance]) *:not(slot, style),
  :host([md-appearance])
    ::slotted(:is(h1, h2, h3, h4, h5, h6, .subtitle, span)) {
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

  ${headingStyleForMedium('h1', `2.857em`, `1.2em`)}
  ${headingStyleForMedium('h2', `2.143em`, `1.2em`)}
  ${headingStyleForMedium('h3', `1.571em`, `1.364em`, 500)}
  ${headingStyleForMedium('h4', `1.286em`, `1.444em`, 500)}
  ${headingStyleForMedium('h5', `1.143em`, `1.5em`)}
  ${headingStyleForMedium('h6', `1.143em`, `1.5em`, 500)}
  ${headingStyleForMedium('.subtitle', `0.857em`, `1.333em`)}
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
];
