export const enum AlertType {
  Info = 'info',
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
}

export const enum Position {
  Start = 'start',
  End = 'end',
  /**
   * @deprecated since 1.4, use `Position.Start` instead
   */
  START = 'start',
  /**
   * @deprecated since 1.4, use `Position.End` instead
   */
  END = 'end',
}

export const enum Direction {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
  /**
   * @deprecated since 1.4, use `Direction.Horizontal` instead
   */
  horizontal = 'horizontal',
  /**
   * @deprecated since 1.4, use `Direction.Vertical` instead
   */
  vertical = 'vertical',
}
