export interface SearchAttributes {
  open?: boolean;
  /**
   * Provides responsive behavior of the search input element, so that the
   * search box leaves more space to other elements. This is especially
   * useful when there's a lack of space, eg. on small screens.
   */
  float?: boolean;
  backIcon?: string;
  searchIcon?: string;
  searchIconPosition?: SearchIconPosition;
  clearIcon?: string;
  clearIconPosition?: ClearIconPosition;
  clearIconAppearance?: ClearIconAppearance;
}

export interface SearchEventDetail {
  query: string;
}

export const enum SearchIconPosition {
  Prefix = 'prefix',
  Suffix = 'suffix',
  None = 'none',
}

export const enum ClearIconPosition {
  After = 'after',
  Suffix = 'suffix',
  None = 'none',
}

export const enum ClearIconAppearance {
  Hover = 'hover',
  Toggle = 'toggle',
  Show = 'show',
}

export const OPEN_EVENT = 'oryx.open';
export const CLOSE_EVENT = 'oryx.close';
