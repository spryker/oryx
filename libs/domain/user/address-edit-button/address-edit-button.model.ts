export const enum Target {
  Link = 'link',
  Modal = 'modal',
  Inline = 'inline',
}

export interface AddressEditButtonOptions {
  target?: Target;
}
