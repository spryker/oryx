import { ApiAddressModel, ApiUserModel } from '../../../models';

export type DeserializedAddress = ApiAddressModel.Payload &
  ApiAddressModel.Address;

export type DeserializedUser = ApiUserModel.User;
