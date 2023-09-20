export type Category = {
  id: string;
  title?: string;
};

export type Product = {
  id: string;
  title: string;
  originalPrice: string;
  currentPrice?: string;
  currentPriceWith10pDiscount?: string;
  previewImageURL?: string;
};

export type SearchParameters = {
  q: string;
};

export type Customer = {
  id?: string;
  name: string;
  email: string;
  password: string;
};
