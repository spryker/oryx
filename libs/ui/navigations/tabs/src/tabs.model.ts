export interface TabsProperties {
  /**
   * The activeTabIndex can be used to define a pre-select tab when
   * component is initialized.
   */
  activeTabIndex: number;

  /**
   * The given value is used to display a shadow in tabs bar border.
   */
  shadow: boolean;
}

/**
 * To define the style to be applied in tabs, can 'primary' or 'secondary' them.
 */
export const enum TabsAppearance {
  Primary = 'primary',
  Secondary = 'secondary',
}
