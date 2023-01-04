export interface TabProperties {
  /**
   * Provides linking the tab to a tab panel. The for attribute is used to select
   * an element by ID.
   *
   * The below example shows how the tab and panel are connected by the `for` and `id` attributes.
   *
   * ```html
   * <oryx-tabs>
   *   <oryx-tab for="myEl">...</oryx-tab>
   *   <div slot="panels" id="myEl">...</div>
   * </oryx-tabs>
   * ```
   *
   * When a for attribute is not available, the tab panel will be toggled based on the DOM order
   * of the tabs vs panels.
   */
  for?: string;

  /**
   * Indicates whether the tab is selected. This property is reflected to allow for styling of the _selected_ tab.
   */
  selected?: boolean;

  /**
   * Indicates whether the tab is has an error. This property is reflected to allow for styling of the tab.
   */
  error?: boolean;
}
