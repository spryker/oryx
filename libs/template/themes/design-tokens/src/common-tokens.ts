import { ThemeToken } from '@spryker-oryx/experience';

export const commonTokens: ThemeToken = {
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
