import { Breakpoint } from '../services/experience/layout/constants';

export interface CompositionProperties {
  rules?: StyleRuleSet[];
}

export interface StyleRuleSet extends StyleProperties {
  breakpoint?: Breakpoint;

  layout?: CompositionLayout;

  /** the number of columns that are used for a column layout  */
  columnCount?: number;

  /** Indicates whether the content is rendered inside a container */
  container?: boolean;

  /**
   * Indicates full width container.
   *
   * The jumbotron can be combined with a container, which means that the content of the
   * jumbotron is constrained by the container size. The esteatics of the jumbotron will
   * however leak out of the container (i.e. full background color)
   *
   */
  jumbotron?: boolean;

  /**
   * Indicates that the composition will stick on the screen at a certain position. The position
   * defaults to 0px from the top, but can be customised using the styling.
   */
  position?: 'sticky';
}

export enum CompositionLayout {
  column = 'column',
  carousel = 'carousel',
}

export interface StyleProperties {
  gap?: string;

  style?: string;

  /** works only with grid based layouts (i.e. two-column grid) */
  gridColSpan?: number;

  top?: string;
  bottom?: string;
  padding?: string;
  margin?: string;

  radius?: string;

  border?: string;

  background?: string;

  /**
   * Indicates the height of the composition.
   *
   * The technical implementation of the height depends on the chosen layout.
   */
  height?: string;

  /**
   * Indicates the width of the composition or item.
   * The technical implementation of the width depends on the chosen layout.
   */
  width?: string;

  justify?: string;
  alignVertically?: string;
}
