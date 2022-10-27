import { Transformer } from '@spryker-oryx/core';
import { Store } from '../../../../models';
import { DeserializedStores } from '../model';

export const StoreNormalizers = 'FES.StoreNormalizers';

export function storeAttributesNormalizer(data: DeserializedStores): Store[] {
  return data;
}

export const storeNormalizers = [storeAttributesNormalizer];

declare global {
  interface InjectionTokensContractMap {
    [StoreNormalizers]: Transformer<Store[]>[];
  }
}
