export type HeadingDirectiveOptions = HeadingAttributes;

export interface HeadingAttributes {
  /**
   * Indicates the heading tag that will be generated.
   */
  tag?: HeadingTag;

  /**
   * The given typography might be different from the element tag, such as using a `h1` tag.
   * Using a different typography than the tag allows to keep screen readers happy, while still
   * allowing to style the heading as needed for the visual experience.
   *
   * A screen specific typography can be set using the `lg`, `md`, and `sm` attributes.
   */
  typography?: HeadingTag | HeadingVisibility;

  /**
   * Set the typography for large screens.
   */
  lg?: HeadingTag | HeadingVisibility;

  /**
   * Set the typography for medium screens.
   */
  md?: HeadingTag | HeadingVisibility;

  /**
   * Set the typography for small screens.
   */
  sm?: HeadingTag | HeadingVisibility;

  /**
   * Indicate the max number of lines that are used for the title.
   *
   * The max lines are set as a css variable (`--max-lines`), and rendering is done with pure CSS.
   * This variable can be set in a ny ancestor element as well so that this property can be omitted.
   */
  maxLines?: number;

  /**
   * @deprecated use `typography` instead. The `hide` and `show` values are no longer supported
   * going forward, elements can be hidden using the `HeadingTag.None` value.
   */
  as?: HeadingTag | HeadingVisibility;

  /**
   * @deprecated use `lg` instead. The `hide` and `show` values are no longer supported
   * going forward, elements can be hidden using the `HeadingTag.None` value.
   */
  asLg?: HeadingTag | HeadingVisibility;

  /**
   * @deprecated use `md` instead. The `hide` and `show` values are no longer supported
   * going forward, elements can be hidden using the `HeadingTag.None` value.
   */
  asMd?: HeadingTag | HeadingVisibility;

  /**
   * @deprecated use `sm` instead. The `hide` and `show` values are no longer supported
   * going forward, elements can be hidden using the `HeadingTag.None` value.
   */
  asSm?: HeadingTag | HeadingVisibility;
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
  Caption = 'caption',
  Subtitle = 'subtitle',
  SubtitleSmall = 'subtitle-small',
  Small = 'small',
  Bold = 'bold',
  Strong = 'strong',
}

export const enum HeadingVisibility {
  /**
   * Hides the heading.
   */
  None = 'none',
  /**
   * @deprecated use `HeadingTag.None` instead
   */
  Hide = 'hide',
  /**
   * @deprecated never used and no longer supported
   */
  Show = 'show',
}
