import { LayoutSpecificAttributes } from '@spryker-oryx/experience/layout';
import { Breakpoint } from '@spryker-oryx/utilities';

export interface CompositionProperties {
  rules?: StyleRuleSet[];
  context?: ContextValue & Record<string, unknown>;
  bucket?: boolean;
  bucketType?: 'main' | 'label';
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

  /**
   * @deprecated since 1.2, will be deleted. Use these properties from layout object.
   */
  zIndex?: number;
  overflow?: string;
}

/**
 * @deprecated since 1.2. Changed enum approach to union in order to add augmentation possibility.
 * Use LayoutTypes instead.
 */
export enum CompositionLayout {
  List = 'list',
  Column = 'column',
  Split = 'split',
  /**
   * @deprecated since 1.2. Use split plugin instead with `columnWidthType: 'aside'`
   */
  SplitAside = 'split-aside',
  /**
   * @deprecated since 1.2. Use split plugin instead with `columnWidthType: 'main'`
   */
  SplitMain = 'split-main',
  Carousel = 'carousel',
  Grid = 'grid',
  Flex = 'flex',
  Text = 'text',
}
