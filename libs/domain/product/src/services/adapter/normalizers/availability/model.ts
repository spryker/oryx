import { ApiProductModel } from '../../../../models';

interface AvailabilityIncludeId {
  id: string;
}

export type DeserializedAvailability = AvailabilityIncludeId &
  ApiProductModel.ProductAvailability;
