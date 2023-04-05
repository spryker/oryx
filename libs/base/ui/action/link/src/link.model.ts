import { Icons } from '@spryker-oryx/ui/icon';

export interface LinkComponentAttributes {
  linkType?: LinkType;
  disabled?: boolean;
  icon?: Icons | string;
  /**
   * Links are expected to be single line by default, and will be attributed with
   * a truncation in case the link text won't fit in the available width. When the
   * link text is supposed to be multi line, the truncation is not applied.
   *
   * @default false
   */
  multiLine?: boolean;
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
