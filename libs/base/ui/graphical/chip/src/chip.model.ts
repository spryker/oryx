export interface ChipAttributes {
  /**
   * Indicates the visual appearance of the chip.
   * Can be one of the predefined values of the ChipAppearance enumeration.
   *
   * The value of this property is used to set the CSS variables:
   * '--oryx-chip-primary' and '--oryx-chip-secondary' by appending
   * the value of this property. If a new value of the enumeration is
   * added, the corresponding CSS variables should also be added.
   */
  appearance?: ChipAppearance;

  /**
   * Indicates if the chip should be displayed in a more compact format.
   */
  dense?: boolean;

  /**
   * Inverts the color scheme for the back and foreground color.
   */
  invert?: boolean;
}

export const enum ChipAppearance {
  Success = 'success',
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
}
