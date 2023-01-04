import { Transformer } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { Store } from '../../../../models';
import { DeserializedStores } from '../model';

export const StoreNormalizer = 'FES.StoreNormalizer*';

export function storeAttributesNormalizer(data: DeserializedStores): Store[] {
  return data;
}

export const storeNormalizer: Provider[] = [
  {
    provide: StoreNormalizer,
    useValue: storeAttributesNormalizer,
  },
];

declare global {
  interface InjectionTokensContractMap {
    [StoreNormalizer]: Transformer<Store[]>[];
  }
}
