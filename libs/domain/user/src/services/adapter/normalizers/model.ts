import { ApiAddressModel } from '../../../models';

export type DeserializedAddress = ApiAddressModel.Payload &
  ApiAddressModel.Address;
