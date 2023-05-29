import { css, CSSResultGroup, unsafeCSS } from 'lit';

/**
 * Generates the css variables for the appearance, e.g. when 'success' is given for appearance,
 * we generate the following css variables:
 *
 * :host([appearance='success']:not([invert])) {
 *   --primary: var(--oryx-chip-success-main, var(--oryx-color-primary-9))
 *   --secondary: var(--oryx-chip-success-main, secondaryColor)
 * }
 *  :host([appearance='success'][invert]) {
 *    --primary: var(--oryx-chip-success-invert, var(--oryx-color-primary-9))
 *  }
 *
 * This will allow to override the chip colors by global CSS (or using the design system tokens):
 *
 * <style>
 *  :root {
 *    --oryx-chip-success-primary: red;
 *    --oryx-chip-success-secondary: yellow;
 *    --oryx-chip-success-invert: blue;
 *  }
 * </style>
 */
const generateChipColorStyles = (
  appearance: string,
  primaryColor: CSSResultGroup,
  secondaryColor: CSSResultGroup,
  invertedPrimaryColor?: CSSResultGroup
): CSSResultGroup => {
  const type = unsafeCSS(appearance);
  const invertCss = invertedPrimaryColor
    ? unsafeCSS(css`
        :host([appearance='${type}'][invert]) {
          --primary: var(--oryx-chip-${type}-invert, ${invertedPrimaryColor});
        }
      `)
    : unsafeCSS(``);

  return css`
    :host([appearance='${type}']) {
      --primary: var(--oryx-chip-${type}-primary, ${primaryColor});
      --secondary: var(--oryx-chip-${type}-secondary, ${secondaryColor});
    }

    ${invertCss}
  `;
};

export const chipBaseStyle = css`
  :host {
    --oryx-chip-primary: var(--oryx-color-neutral-400);
    --oryx-chip-secondary: var(--oryx-color-canvas-500);
    --oryx-chip-invert: var(--oryx-color-neutral-300);

    display: inline-block;
    padding-inline: 12px;
    line-height: 24px;
    flex-grow: 0;
    flex-shrink: 0;
    height: 24px;
    border-radius: 10px;
  }

  :host([dense]) {
    padding-inline: 7px;
  }

  slot {
    display: block;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  :host(:not([invert])) {
    color: var(--primary, var(--oryx-chip-default-primary));
    background-color: var(--secondary, var(--oryx-chip-secondary));
  }

  :host([invert]) {
    color: var(--oryx-color-canvas-100);
    background-color: var(--primary, var(--oryx-chip-primary));
  }

  ${generateChipColorStyles(
    'success',
    unsafeCSS('var(--oryx-color-success-400)'),
    unsafeCSS('var(--oryx-color-success-100)'),
    unsafeCSS('var(--oryx-color-success-300)')
  )}

  ${generateChipColorStyles(
    'info',
    unsafeCSS('var(--oryx-color-info-300)'),
    unsafeCSS('var(--oryx-color-info-100)')
  )}

  ${generateChipColorStyles(
    'warning',
    unsafeCSS('var(--oryx-color-warning-500)'),
    unsafeCSS('var(--oryx-color-warning-100)'),
    unsafeCSS('var(--oryx-color-warning-300)')
  )}

  ${generateChipColorStyles(
    'error',
    unsafeCSS('var(--oryx-color-error-400)'),
    unsafeCSS('var(--oryx-color-error-100)'),
    unsafeCSS('var(--oryx-color-error-300)')
  )}
`;
