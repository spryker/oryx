export interface CollapsibleTextProperties {
  lineClamp?: number;
  toggle?: CollapsibleTextToggle;
}

export const enum CollapsibleTextToggle {
  None = 'none',
  Icon = 'icon',
  Text = 'text',
}
