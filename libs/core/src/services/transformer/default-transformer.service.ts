import { resolve } from '@spryker-oryx/injector';
import { Transformer, TransformerService } from './transformer.service';

/**
 * Transforms data by transformer(s) callback
 */
export class DefaultTransformerService implements TransformerService {
  transform<T, D>(data: D, token: keyof InjectionTokensContractMap): T {
    return this.getTransformers(token).reduce(
      (currentData: unknown, cb: Transformer<any>) => {
        const cbData = cb(data, this);

        if (
          currentData === null ||
          Array.isArray(currentData) ||
          typeof currentData !== 'object'
        ) {
          return cbData;
        }

        return {
          ...currentData,
          ...cbData,
        };
      },
      null
    );
  }

  getTransformers(token: keyof InjectionTokensContractMap): Transformer[] {
    const transformer = resolve<Transformer | Transformer[]>(token);

    return Array.isArray(transformer) ? transformer : [transformer];
  }
}
