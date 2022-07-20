import { CamelCase } from '@spryker-oryx/typescript-utils';
import { ApiCartModel } from '../../../models';

export type DeserializedCartIncludes = {
  [P in ApiCartModel.Includes as `${CamelCase<P>}`]?: P extends ApiCartModel.Includes.GuestCartItems
    ? ApiCartModel.Entry[]
    : never;
};
