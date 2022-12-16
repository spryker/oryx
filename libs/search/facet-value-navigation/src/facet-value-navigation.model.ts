export const FACET_SEARCH_EVENT = 'oryx.search';
export const FACET_TOGGLE_EVENT = 'oryx.toggle';
export const FACET_CLEAR_EVENT = 'oryx.clear';

export interface SearchFacet {
  value: string;
}

export interface ShowFacet {
  isShowed: boolean;
}
