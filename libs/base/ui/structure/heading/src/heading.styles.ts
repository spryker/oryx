import { screenCss } from '@spryker-oryx/utilities';
import { css } from 'lit';

export const headingStyles = css`
  :host {
    display: inline-block;
    text-align: start;
    text-wrap: balance;
  }

  :host([style*='--max-lines']) {
    /* stylelint-disable-next-line */
    display: -webkit-inline-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: var(--max-lines);
    overflow: hidden;
  }

  :host > *,
  ::slotted(*) {
    font-size: var(--_f-r, var(--_f));
    font-weight: var(--_w-r, var(--_w));
    line-height: var(--_l-r, var(--_l));
    margin: 0;
  }

  caption {
    display: inline;
  }

  :host([typography='subtitle']),
  :host([tag='subtitle']) {
    text-transform: uppercase;
  }
`;

/**
 * The following styles are used to set the font-size, font-weight
 * and line-height for different screen sizes.
 */
export const headingScreenStyles = screenCss({
  lg: css`
    :host {
      --_f-r: var(--_f-lg);
      --_w-r: var(--w-lg);
      --_l-r: var(--_l-lg);
    }
  `,
  md: css`
    :host {
      --_f-r: var(--_f-md);
      --_w-r: var(--w-md);
      --_l-r: var(--_l-md);
    }
  `,
  sm: css`
    :host {
      --_f-r: var(--_f-sm);
      --_w-r: var(--w-sm);
      --_l-r: var(--_l-sm);
    }
  `,
});
