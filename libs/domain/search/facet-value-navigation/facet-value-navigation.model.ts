export const FACET_TOGGLE_EVENT = 'oryx.toggle';
export const FACET_CLEAR_EVENT = 'oryx.clear';

export interface SearchFacet {
  value: string;
}

export interface ShowFacet {
  isShowed: boolean;
}

export interface FacetValueNavigationComponentAttributes {
  /**
   * Name of the facet which should be rendered.
   */
  heading?: string;
  /**
   * Length of all facet values.
   */
  valuesLength?: number;
  /**
   * Length of active facet values.
   */
  selectedLength?: number;
  /**
   * Enables rendering of the toggle button for facet content.
   */
  enableToggle?: boolean;
  /**
   * Enables rendering search field.
   */
  enableSearch?: boolean;
  /**
   * Indicates that collapsible is open or close by default.
   */
  open?: boolean;

  enableClearAction?: boolean;
}
