import { ProductLabel, ProductLabelAppearance } from '@spryker-oryx/product';
import { ApiProductModel } from '../../../models/product.api.model';

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
