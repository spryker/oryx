export interface ProductTitleContent {
  /**
   * Specifies the html tag that is used to render the title.
   *
   * On a PDP, the product title is most likely rendered in a H1 to
   * get the best indexing from search engines. However, at other
   * places, the title might be rendered in a H3 or different.
   */
  tag: string;

  /**
   * Forces the title to not leave a single line. This can be helpful for
   * layouts with not to much space, i.e. in a carousel, typeahead search
   * or shopping cart entry.
   */
  singleLine?: boolean;
}
