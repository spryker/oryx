import { Icons } from '@spryker-oryx/ui/icon';

export interface LinkComponentAttributes {
  linkType?: LinkType;
  disabled?: boolean;
  icon?: Icons | string;
  singleLine?: boolean;
  color?: ColorType;
}

export const enum LinkType {
  Link = 'link',
  ExternalLink = 'external',

  /**
   * clears the styling of the link component states, such has the color on
   * hover, active and focus state.
   */
  Neutral = 'neutral',
}

export const enum ColorType {
  Primary = 'primary',
  Neutral = 'neutral',
}
