import { SuggestionRendererOptions } from '@spryker-oryx/search';

export interface SearchBoxProperties {
  /**
   * Query string that is using for suggestions search
   */
  query?: string;
}

export interface SearchBoxOptions extends SuggestionRendererOptions {
  /**
   * Minimum amount of characters required for querying the suggestion
   */
  minChars?: number;
  /**
   * Provides responsive behavior of the search input element, so that the
   * search box leaves more space to other elements. This is especially
   * useful when there's a lack of space, eg. on small screens.
   */
  float?: boolean;
}
