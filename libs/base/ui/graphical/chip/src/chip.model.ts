export enum ChipAppearance {
  Default = 'default',
  Success = 'success',
  Offline = 'offline',
  Inactive = 'inactive',
  Low = 'low',
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
  Highlight = 'highlight',
  /**
   * `ONLINE` is a synonym for the `SUCCESS` chip type.
   */
  Online = 'online',
  /**
   * `ACTIVE` is a synonym for the `SUCCESS` chip type.
   */
  Active = 'active',
}

export interface ChipAttributes {
  /**
   * Defines the chip color
   *
   * @defaults `ChipAppearance.Default`
   */
  appearance?: ChipAppearance;

  /**
   * Makes smaller chip paddings
   */
  dense?: boolean;
}
