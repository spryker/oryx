import { CamelCase } from '@spryker-oryx/typescript-utils';
import { ApiProductModel } from '../../../../models';
import { DeserializedProductIncludes } from '../model';

export type DeserializedAbstract = ApiProductModel.Abstract &
  Pick<
    DeserializedProductIncludes,
    CamelCase<ApiProductModel.Includes.ConcreteProducts>
  >;
