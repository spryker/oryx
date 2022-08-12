import { Variant, VariantOptions } from './variant.model';

export const extendVariants = <T extends Variant>(
  variants: T[],
  {
    options,
    categoryY,
    categoryX,
  }: { options?: VariantOptions; categoryY?: string; categoryX?: string }
): T[] => {
  return variants.map((variant) => ({
    ...variant,
    categoryY: categoryY || variant.categoryY,
    categoryX: categoryX || variant.categoryX,
    options: {
      ...variant.options,
      ...options,
    },
  }));
};
