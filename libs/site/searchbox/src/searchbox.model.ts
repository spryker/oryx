export interface SiteSearchboxProperties {
  /**
   * Query string that is using for suggestions search
   */
  query?: string;
}

export interface QueryControlTranslations {
  clearButtonTitle: string;
  closeButtonArialLabel: string;
}

export interface SuggestionTranslations {
  nothingFoundText: string;
  completionTitle: string;
  categoriesTitle: string;
  cmsTitle: string;
  productsTitle: string;
  viewAllProductsButtonTitle?: string;
}

export interface SiteSearchboxTranslations
  extends QueryControlTranslations,
    SuggestionTranslations {
  placeholder: string;
}

export interface SiteSearchboxOptions {
  /**
   * Minimum amount of characters required for querying the suggestion
   */
  minChars?: number;
}
