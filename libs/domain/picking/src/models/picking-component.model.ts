export interface PickingListComponentProperties {
  pickingListId?: string;
}

export interface ProductItemPickedEvent {
  productId: string;
  numberOfPicked?: number;
}

export const EVENT_SUBMIT = 'oryx.submit';
export const EVENT_EDIT = 'oryx.edit';
