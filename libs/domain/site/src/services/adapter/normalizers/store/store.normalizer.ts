import { Transformer } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { Store } from '../../../../models';
import { DeserializedStores } from '../model';

export const StoreNormalizer = 'oryx.StoreNormalizer*';

export function storeAttributesNormalizer(data: DeserializedStores): Store[] {
  // TODO: drop this when the backend is healthy again; current dynamic
  // multi-store backend is exposing numbers rather than the locale isocode.
  data.map((store) =>
    store.locales.map((locale) => {
      if (!isNaN(Number(locale.code)))
        locale.code = locale.name.split(/_|-/)?.[0];

      return locale;
    })
  );

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
