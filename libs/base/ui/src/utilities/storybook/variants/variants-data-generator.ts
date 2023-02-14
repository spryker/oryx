import { Variant } from './variant.model';

export const extendVariants = <T extends Variant>(
  variants: T[],
  { options, categoryY, categoryX }: Partial<Variant>
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
