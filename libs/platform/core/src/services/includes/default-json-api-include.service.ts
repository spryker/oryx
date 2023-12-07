import { inject, INJECTOR } from '@spryker-oryx/di';
import { Observable, of } from 'rxjs';
import {
  IncludeDefinition,
  IncludesQualifier,
  JsonApiIncludeService,
} from './json-api-include.service';
import { includesTokenFactory } from './provide-includes';

export class DefaultJsonApiIncludeService implements JsonApiIncludeService {
  protected cache = new Map<string, string>();

  constructor(protected injector = inject(INJECTOR)) {}

  get(qualifier: IncludesQualifier): Observable<string> {
    const cacheKey = this.createCacheKey(qualifier);
    if (this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey)!);
    }

    const config: IncludeDefinition[] = [
      ...this.injector.inject(includesTokenFactory(qualifier.resource), []),
      ...(qualifier.includes ?? []),
    ].flat(Infinity);

    if (!config.length) return of('');

    const includesSet = new Set<string>();
    const fieldsMap: Record<string, Set<string>> = {};

    for (const include of config) {
      if (typeof include === 'string') {
        includesSet.add(include);
      } else if (include.include) {
        includesSet.add(include.include);

        if (!fieldsMap[include.include]) {
          fieldsMap[include.include] = new Set<string>(include.fields);
        } else {
          fieldsMap[include.include].forEach((field) =>
            fieldsMap[include.include].add(field)
          );
        }
      }
    }

    const fields = Object.entries(fieldsMap).map(
      ([key, value]) => `&fields[${key}]=${Array.from(value).join(',')}`
    );

    const result =
      `include=${Array.from(includesSet).join(',')}` +
      (fields.length ? `${fields.join()}` : '');

    this.cache.set(cacheKey, result);
    return of(result);
  }

  protected createCacheKey(qualifier: IncludesQualifier): string {
    return `${qualifier.resource}:${(qualifier.includes ?? []).join(',')}`;
  }
}
