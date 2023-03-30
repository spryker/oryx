export interface PickingProduct {
  id: string;
  sku: string;
  productName: string;
  image: string | null;
  imageLarge: string | null;
}

export interface ProductItemPickedEvent {
  productId: string;
  numberOfPicked?: number;
}

export const EVENT_CHANGE_NUMBER_OF_PICKED = 'oryx.change-number-of-picked';
export const EVENT_SUBMIT = 'oryx.submit';
export const EVENT_EDIT = 'oryx.edit';
