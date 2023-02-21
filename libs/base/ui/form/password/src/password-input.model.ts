export const enum PasswordVisibilityStrategy {
  /**
   * Do not show the password at any times.
   *
   * This feature might be preferred by the security team, as there's no change to leak
   * the password on the screen.
   */
  None = 'none',

  /**
   * Makes the password visible when the user hold the mouse down on the eye icon. As soon as the
   * user releases the icon, the password will continue to hidden again.
   *
   * This is considered the 2nd most secured option, as the user needs to actively click on the icon
   * and will only remain visible as long as the user holds down the mouse.
   */
  Mousedown = 'mousedown',

  /**
   * Makes the password visible when the user clicks on the eye icon. The password remains visible until
   * the timeout time has passed.
   */
  Click = 'click',

  /**
   * Makes the password visible when the user hold the mouse down on the eye icon. As soon as the
   * user releases the icon, the password will continue to hidden again.
   *
   * This might not be preferred as the user can accidentally hover over the eye icon.
   */
  Hover = 'hover',
}
