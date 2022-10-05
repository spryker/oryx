import { Transformer } from '@spryker-oryx/core';
import {
  ApiProductModel,
  ProductLabel,
  ProductLabelAppearance,
} from '../../../../models';

export const ProductLabelsNormalizers = 'FES.ProductLabelsNormalizers';

export function productLabelNormalizer(
  data: ApiProductModel.ProductLabel[]
): ProductLabel[] {
  const normalizeAppearance = (data: ApiProductModel.ProductLabel): string => {
    switch (data.frontEndReference) {
      case 'highlight':
        return ProductLabelAppearance.Highlight;
      default:
        return ProductLabelAppearance.Info;
    }
  };

  return (data ?? []).map(
    (label) =>
      ({
        name: label.name,
        appearance: normalizeAppearance(label),
      } as ProductLabel)
  );
}

export const productLabelsNormalizers = [productLabelNormalizer];

declare global {
  interface InjectionTokensContractMap {
    [ProductLabelsNormalizers]: Transformer<ProductLabel[]>[];
  }
}
