import { screenCss } from '@spryker-oryx/utilities';
import { css } from 'lit';

export const headingStyles = css`
  :host {
    text-wrap: balance;
    display: inline-block;
  }

  :host > * {
    font-size: var(--_s-r, var(--_s));
    font-weight: var(--_w-r, var(--_w));
    line-height: var(--_l-r, var(--_l));
    margin: 0;
  }

  :host[style*='--max-lines'] {
    /* stylelint-disable-next-line */
    display: -webkit-inline-box;
    text-align: start;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: var(--max-lines);
    overflow: hidden;
  }

  :host(:is([typography='subtitle'], [tag='subtitle'])) {
    text-transform: uppercase;
  }

  caption {
    display: inline;
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
    }
  `,
  md: css`
    :host {
      --_s-r: var(--_s-md);
      --_w-r: var(--w-md);
      --_l-r: var(--_l-md);
    }
  `,
  sm: css`
    :host {
      --_s-r: var(--_s-sm);
      --_w-r: var(--w-sm);
      --_l-r: var(--_l-sm);
    }
  `,
});
