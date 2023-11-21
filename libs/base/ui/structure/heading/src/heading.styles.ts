import { screenCss } from '@spryker-oryx/utilities';
import { css } from 'lit';

export const headingStyles = css`
  :host > *,
  ::slotted(*) {
    font-size: var(--_fs);
    font-weight: var(--_fw);
    line-height: var(--_lh);
    margin: 0;
    text-wrap: balance;
    /* stylelint-disable-next-line */
    display: -webkit-inline-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: var(--line-clamp);
    overflow: hidden;
    text-align: start;
  }

  strong {
    display: inline;
  }

  .subtitle {
    text-transform: uppercase;
  }
`;

/**
 * The following styles are used to set the font-size, font-weight and line-height
 * for different screen sizes.
 */
export const headingScreenStyles = screenCss({
  lg: css`
    [style*='-lg'] {
      font-size: var(--_fs-lg, var(--_fs));
      font-weight: var(--_fw-lg, var(--_fw));
      line-height: var(--_lh-lg, var(--_lh));
    }
  `,
  md: css`
    [style*='-md'] {
      font-size: var(--_fs-md, var(--_fs));
      font-weight: var(--_fw-md, var(--_fw));
      line-height: var(--_lh-md, var(--_lh));
    }
  `,
  sm: css`
    [style*='-sm'] {
      font-size: var(--_fs-sm, var(--_fs));
      font-weight: var(--_fw-sm, var(--_fw));
      line-height: var(--_lh-sm, var(--_lh));
    }
  `,
});
