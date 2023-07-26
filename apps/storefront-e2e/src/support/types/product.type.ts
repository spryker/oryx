export type Product = {
  id: string;
  title: string;
  originalPrice: string;
  currentPrice?: string;
  currentPriceWith10pDiscount?: string;
  previewImageURL?: string;
};
