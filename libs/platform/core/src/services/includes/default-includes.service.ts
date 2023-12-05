import { inject, INJECTOR } from '@spryker-oryx/di';
import { Observable, of } from 'rxjs';
import {
  IncludeDefinition,
  IncludesQualifier,
  IncludesService,
} from './includes-service';
import { includesTokenFactory } from './provide-includes';

export class DefaultIncludesService implements IncludesService {
  constructor(protected injector = inject(INJECTOR)) {}

  get({ entity }: IncludesQualifier): Observable<string> {
    const config: IncludeDefinition[] = this.injector
      .inject(includesTokenFactory(entity), [])
      .flat(2);

    if (!config.length) return of('');

    const includes = new Set<string>();
    const fieldsMap: Record<string, Set<string>> = {};

    for (const include of config) {
      if (typeof include === 'string') {
        includes.add(include);
      } else if ('ref' in include) {
      } else if (include.include) {
        includes.add(include.include);

        if (!fieldsMap[include.include]) {
          fieldsMap[include.include] = new Set<string>(include.fields);
        } else {
          fieldsMap[include.include] = new Set<string>([
            ...fieldsMap[include.include],
            ...include.fields,
          ]);
        }
      }
    }

    const fields = Object.entries(fieldsMap).map(
      ([key, value]) => `&fields[${key}]=${Array.from(value).join(',')}`
    );

    const result =
      `include=${Array.from(includes).join(',')}` +
      (fields.length ? `${fields.join()}` : '');

    return of(result);
  }
}
