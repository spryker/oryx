export interface PickingProduct {
  id: string;
  sku: string;
  productName: string;
  image: string | null;
  imageLarge: string | null;
}

export interface ProductItemPickedEvent {
  productId: string;
  numberOfPicked: number;
}
