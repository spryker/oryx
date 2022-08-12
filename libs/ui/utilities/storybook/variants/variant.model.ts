export interface VariantOptions {
  [key: string | number]: unknown;
}

export interface Variant {
  categoryX: string;
  categoryY: string;
  options: VariantOptions;
}
