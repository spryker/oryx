export interface UserAddressEditComponentOptions {
  /**
   * Allows to configure the component to use an explicit save button, instant
   * saving or not save at all. In case of not providing a save mechanism,
   * the host component is supposed to save the address by listening to the
   * `change` event.
   */
  save?: SaveOption;

  inline?: boolean;
}

export const enum SaveOption {
  Instant = 'instant',
  Save = 'save',
  None = 'none',
}
