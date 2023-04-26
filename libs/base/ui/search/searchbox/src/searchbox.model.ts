export interface SearchAttributes {
  open?: boolean;
  /**
   * Prevent floating behaviour on small screens
   */
  notFloated?: boolean;
  backIcon?: string;
  searchIcon?: string;
  searchIconPosition?: SearchIconPosition;
  clearIcon?: string;
  clearIconPosition?: ClearIconPosition;
  clearIconAppearance?: ClearIconAppearance;
}

export interface SearchEvent {
  query?: string;
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
