import { ThemeToken } from '@spryker-oryx/experience';

export const commonTokens: ThemeToken = {
  /** @deprecated use oryx-shadow instead */
  elevation: {
    /**
     * @deprecated use oryx-shadow-color instead
     */
    'color-2': 'rgb(0 0 0 / 10%)',
    /** @deprecated use oryx-shadow-flat instead */
    0: '0 1px 3px',
    /** @deprecated use oryx-shadow-raised instead */
    1: '0 4px 8px',
    /** @deprecated use oryx-shadow-hovering instead */
    2: '1px 3px 18px',
    /** @deprecated use oryx-shadow-floating instead */
    3: '-2px 2px 20px',
  },
  shadow: {
    /** @since 1.3, replaced oryx-elevation-0 */
    flat: '0 1px 3px',
    /** @since 1.3, replaced oryx-elevation-1 */
    raised: '0 4px 8px',
    /** @since 1.3, replaced oryx-elevation-2 */
    hovering: '1px 3px 18px',
    /** @since 1.3, replaced oryx-elevation-3 */
    floating: '-2px 2px 20px',
    /** @since 1.3, replaced oryx-elevation-color; the color has become
     * a little bit lighter.
     */
    color: 'rgba(0 0 0 / 10%)',
  },
};

export const commonTokensSmall: ThemeToken = {
  screen: {
    small: {
      inline: 'inline',
      hide: 'none',
    },
  },
};
