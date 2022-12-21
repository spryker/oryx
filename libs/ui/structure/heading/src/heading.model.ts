export interface HeadingAttributes {
  /**
   * Indicates the heading level that will be generated.
   */
  tag?: HeadingTag;

  /**
   * Indicate the max number of lines that are used for the title.
   *
   * The max lines are set as a css variable (`--max-lines`), and rendering is done with pure CSS.
   * This variable can be set in a ny ancestor element as well so that this property can be omitted.
   */
  maxLines?: number;

  /**
   * Screen readers require to have a strict structure of the DOM, so that users who depend on a
   * readable structure can understand the structure of the page. For users who have visual sight,
   * the UI offers more layout and styling capabilities to express the structure of the content. UI
   * designer therefore might ignore the formal structural elements and style the headings depending
   * on the layout.
   *
   * To overcome this problem, the component allows to _mimic_ a certain style for a semantic element.
   *
   * The following example renders visually as an h3, while the semantic element is an `h1`.
   * ```html
   * <oryx-heading appearance="h3">
   *   <h1>Heading text</h1>
   * </oryx-heading>
   * ```
   */
  appearance?: string;

  /**
   * Similar to the generic _appearance_ behaviour you can mimic a certain style for medium (and larger)
   * screen size.
   */
  mdAppearance?: string;
}

/**
 * The heading tag is used to generate a wrapping DOM element inside the heading to
 * provide the right styles.
 */
export const enum HeadingTag {
  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
  H4 = 'h4',
  H5 = 'h5',
  H6 = 'h6',
  Subtitle = 'subtitle',
}
