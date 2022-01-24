import { SearchController } from './search.controller';

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

export declare class SearchInterface {
  searchController: SearchController;

  searchIconPosition?: SearchIconPosition;
  searchIcon?: string;
  clearIcon?: string;
}
