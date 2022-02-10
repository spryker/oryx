import { AffixOptions, FormControlOptions } from '../../input';

export interface SearchOptions extends FormControlOptions, AffixOptions {
  searchIconPosition?: SearchIconPosition;
  searchIcon?: string;
  clearIcon?: string;
}

export interface SearchEvent {
  query?: string;
}

export interface Suggestion {
  title: string;
}

export const enum SearchIconPosition {
  START = 'START',
  END = 'END',
  NONE = 'NONE',
}
