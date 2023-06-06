export const enum Target {
  Link = 'link',
  Modal = 'modal',
  Inline = 'inline',
}

export interface AddressEditTriggerOptions {
  target?: Target;
}
