import { IncludeDefinition, IncludesToken } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';

export const includesTokenFactory = (entity: string) =>
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
