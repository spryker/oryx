import { ApiProductModel } from '../../../models/product.api.model';

interface AvailabilityIncludeId {
  id: string;
}

export type DeserializedAvailability = AvailabilityIncludeId &
  ApiProductModel.ProductAvailability;
