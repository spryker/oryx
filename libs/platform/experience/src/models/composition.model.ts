import { LayoutSpecificAttributes } from '@spryker-oryx/experience/layout';
import { Breakpoint } from '@spryker-oryx/utilities';

export interface CompositionProperties {
  rules?: StyleRuleSet[];
  [key: string]: unknown;
}

export interface ComponentVisibility {
  hide?: boolean;
  hideByRule?: string;
}

export interface StyleRuleSet
  extends StyleProperties,
    LayoutSpecificAttributes,
    ComponentVisibility {
  /**
   * Allows to apply a style rule set for specific selectors.
   */
  query?: {
    breakpoint?: Breakpoint | string;
    childs?: boolean;
    hover?: boolean;
  };
  [key: string]: unknown;
}

export interface StyleProperties extends LayoutStylesProperties {
  style?: string;
}

/**
 * @deprecated since 1.2. Changed enum approach to union in order to add augmentation possibility.
 * Use LayoutTypes instead.
 */
export enum CompositionLayout {
  List = 'list',
  Column = 'column',
  Split = 'split',
  SplitAside = 'split-aside',
  SplitMain = 'split-main',
  Carousel = 'carousel',
  Grid = 'grid',
  Flex = 'flex',
  Text = 'text',
}
