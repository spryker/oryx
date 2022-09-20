import { CamelCase } from '@spryker-oryx/typescript-utils';
import { ApiCheckoutModel } from '../../../../models';
import { DeserializedCheckoutIncludes } from '../model';

export type DeserializedCheckout = ApiCheckoutModel.Attributes &
  Pick<
    DeserializedCheckoutIncludes,
    CamelCase<ApiCheckoutModel.Includes.Shipments>
  >;
