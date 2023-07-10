export interface CollapsibleTextProperties {
  /**
   * The line-clamp property truncates text at a specific number of lines.
   */
  lineClamp?: number;

  /**
   * Indicates whether the truncated lines should be toggled, and which ux controlled
   * is used for this.
   */
  toggle?: CollapsibleTextToggle;
}

export const enum CollapsibleTextToggle {
  None = 'none',
  Icon = 'icon',
  Text = 'text',
}
