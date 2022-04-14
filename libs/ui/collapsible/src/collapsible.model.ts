export interface CollapsibleProps {
  /**
   * allow to control expanded state of component
   */
  open?: boolean;
  /**
   * text for title label can be provided as an attribute
   * and as a content for named slot (slot="header")
   */
  header?: string;
}
