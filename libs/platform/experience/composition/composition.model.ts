export interface CompositionComponentProperties {
  /**
   * The bucket is used to filter the components that are rendered in the composition.
   * When the bucket is not set, components with a bucket assigned are not rendered.
   * When the bucket property is set, only components with the bucket assigned
   * are rendered.
   *
   * The bucket is used to render specific components inside layouts. For example,
   * the `label` bucket is used to add an optional label for the `dropdown` or
   * `collapsible` component.
   */
  bucket?: string;
}
