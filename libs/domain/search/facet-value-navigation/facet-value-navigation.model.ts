export const FACET_TOGGLE_EVENT = 'oryx.toggle';
export const FACET_CLEAR_EVENT = 'oryx.clear';

export interface ToggleFacetEventDetail {
  expanded: boolean;
}

export interface SearchFacetValueNavigationComponentAttributes {
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
  /**
   * Show the clear button at the facet's header
   */
  enableClear?: boolean;
  /**
   * Indicates that facet has dirty values in comparison with initial ones.
   */
  dirty?: boolean;
}
