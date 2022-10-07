import { CamelCase } from '@spryker-oryx/core/utilities';
import { ApiCheckoutModel } from '../../../../models';
import { DeserializedCheckoutIncludes } from '../model';

export type DeserializedCheckout = ApiCheckoutModel.Attributes &
  Pick<
    DeserializedCheckoutIncludes,
    CamelCase<ApiCheckoutModel.Includes.Shipments>
  >;
