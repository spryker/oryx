export interface ContentComponentProperties<
  OptionsType = unknown,
  ContentType = unknown
> {
  /**
   * Unique identifier that references the component. The `uid` is used to get
   * the component data from the page structure, or - if not available - from
   * the backend in a separate call.
   */
  uid?: string;

  /**
   * Component content is loaded from the backend, but can be added through a
   * property as well. When content is added through component properties, the
   * component uid will be ignored.
   */
  content?: ContentType;

  /**
   * Component options are loaded from the backend, but can be added through a
   * property as well. When options are added through component properties, the
   * component uid will be ignored.
   */
  options?: OptionsType;

  /**
   * The bucket represents the location where the component content is used. An
   * example of a bucket is the `label` bucket, which is used for navigation
   * components such as the `dropdown` or `collapsible` component. The label
   * component(s) can be used for custom trigger elements.
   */
  bucket?: string;
}
