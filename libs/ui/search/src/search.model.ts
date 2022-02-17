import { AffixOptions, FormControlOptions } from '../../input';

export interface SearchOptions extends FormControlOptions, AffixOptions {
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
  PREFIX = 'PREFIX',
  SUFFIX = 'SUFFIX',
  NONE = 'NONE',
}

export const enum ClearIconPosition {
  AFTER = 'AFTER',
  SUFFIX = 'SUFFIX',
  NONE = 'NONE',
}

export const enum ClearIconAppearance {
  HOVER = 'HOVER',
  TOGGLE = 'TOGGLE',
  SHOW = 'SHOW',
}
