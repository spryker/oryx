export interface PageNavigationProperties {
  /**
   * When the navigation is disabled, the component won't scroll to the related section.
   * The host application must navigate, which can be done by listening to the section-change event.
   */
  disableNavigation: boolean;
  /**
   * Selector string that is using to query the container which contains related sections.
   */
  sectionsContainerSelector: string;
}
