export interface MultiRangeProperties {
  /**
   * Provides a minimum value leveraging standard input attribute under the hood.
   * The value can't be bigger then max.
   *
   * @default 0
   */
  min: number;

  /**
   * Provides a maximum value leveraging standard input attribute under the hood.
   * The value can't be lower then min.
   *
   * @default 100
   */
  max: number;

  /**
   * Provides the minimum value of the selected range. Must be in [min, max] range.
   * The value can't be bigger then maxValue.
   *
   * @default 0
   */
  minValue: number;

  /**
   * Provides the maximum value of the selected range. Must be in [min, max] range.
   * The value can't be lower then minValue.
   *
   * @default 100
   */
  maxValue: number;

  /**
   * Provides a stepping interval between minValue and MaxValue and leveraging standard input attribute under the hood.
   * There always must be at least 1 step between minValue and maxValue.
   *
   * @default 1
   */
  step?: number;

  disabled?: boolean;
}

export interface MultiRangeChangeEvent {
  minValue: number;
  maxValue: number;
}
