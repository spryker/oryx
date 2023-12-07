import { LayoutPlugin } from '../../layout.plugin';

export const SplitLayoutPluginToken = `${LayoutPlugin}split`;

export interface SplitLayoutProperties {
  /**
   * Specifies the type of width distribution for the first column in a split layout.
   *
   * The `columnWidthType` property allows you to define how the width of the first column is determined.
   * You can choose from the following options:
   * - 'equal': The first column's width is equal to the other columns in the split layout.
   * - 'main': The first column is designated as the main content column and may have a wider width.
   * - 'aside': The first column is designated as a side or aside content column, which may have a narrower width.
   *
   * @type {'equal' | 'main' | 'aside'}
   * @default 'equal'
   */
  columnWidthType?: 'equal' | 'main' | 'aside';
}

declare global {
  export interface Layouts {
    split: undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface LayoutProperty extends SplitLayoutProperties {}
}
