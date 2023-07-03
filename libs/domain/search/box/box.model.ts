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
}
