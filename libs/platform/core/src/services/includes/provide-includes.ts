import { Provider } from '@spryker-oryx/di';
import { IncludeDefinition, IncludesToken } from './includes-service';

export const includesTokenFactory = (entity: string): string =>
  `${IncludesToken}${entity}*`;

export function provideIncludes(
  entity: string,
  includes: IncludeDefinition[],
  existing?: string
): Provider[] {
  const providers: Provider[] = includes
    ? [
        {
          provide: includesTokenFactory(entity),
          useValue: includes,
        },
      ]
    : [];

  if (existing) {
    providers.push({
      provide: includesTokenFactory(entity),
      useExisting: includesTokenFactory(existing),
    });
  }
  console.log('providers', providers);
  return providers;
}
