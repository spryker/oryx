import { screenCss } from '@spryker-oryx/utilities';
import { css } from 'lit';

/**
 * The headingStyles are used to set the font-size, font-weight
 * and line-height for the heading for different screen sizes.
 *
 * The `--_s` variable is used to set the font-size.
 * The `--_w` variable is used to set the font-weight.
 * The `--_l` variable is used to set the line-height.
 * The `--_d` variable is used to set the display property for the heading.
 * The `--_t` variable is used to set the text-transform property for the heading.
 *
 * If those variables have a `-r` suffix, it indicates that the value is added
 * for responsiveness.
 *
 * The optional max lines are set as a css variable (`--max-lines`), and rendering
 * is done with pure CSS, using the line-clamp property.
 */
export const headingStyles = css`
  :host {
    display: var(--_d-r, var(--_d, var(--_clamp, block)));
    text-wrap: balance;
  }

  :host > * {
    font-size: var(--_s-r, var(--_s));
    font-weight: var(--_w-r, var(--_w));
    line-height: var(--_l-r, var(--_l));
    text-transform: var(--_t-r, var(--_t));
    margin: 0;
  }

  :host([style*='--max-lines']) {
    /* stylelint-disable-next-line */
    --_clamp: -webkit-inline-box;

    -webkit-box-orient: vertical;
    -webkit-line-clamp: var(--max-lines);
    overflow: hidden;
  }
`;

/**
 * The following styles are used to set the font-size, font-weight
 * and line-height for different screen sizes.
 */
export const headingScreenStyles = screenCss({
  lg: css`
    :host {
      --_s-r: var(--_s-lg);
      --_w-r: var(--w-lg);
      --_l-r: var(--_l-lg);
      --_d-r: var(--_d-lg);
      --_t-r: var(--_t-lg);
    }
  `,
  md: css`
    :host {
      --_s-r: var(--_s-md);
      --_w-r: var(--w-md);
      --_l-r: var(--_l-md);
      --_d-r: var(--_d-md);
      --_t-r: var(--_t-md);
    }
  `,
  sm: css`
    :host {
      --_s-r: var(--_s-sm);
      --_w-r: var(--w-sm);
      --_l-r: var(--_l-sm);
      --_d-r: var(--_d-sm);
      --_t-r: var(--_t-sm);
    }
  `,
});
