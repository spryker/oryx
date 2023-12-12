import { INJECTOR, inject } from '@spryker-oryx/di';
import { Observable, map, of, switchMap, throwError } from 'rxjs';
import { ContextService } from '../context';
import { EntityProvider } from './entity-provider';
import {
  EntityFieldQualifier,
  EntityQualifier,
  EntityService,
} from './entity.service';

export class DefaultEntityService implements EntityService {
  protected injector = inject(INJECTOR);
  protected context = inject(ContextService);

  get<E = unknown, T = unknown>({
    qualifier,
    element,
    type,
  }: EntityQualifier<T>): Observable<E | undefined> {
    const config = this.getConfig(type);

    if (!config) {
      return throwError(
        () => new Error(`No entity provider found for entity ${type}`)
      );
    }

    let qualifier$: Observable<T | undefined>;

    if (!qualifier) {
      // resolve qualifier from context

      if (!config.context) {
        return throwError(
          () => new Error(`No context or qualifier provided for entity ${type}`)
        );
      }

      qualifier$ = this.context.get(element ?? null, config.context);
    } else {
      qualifier$ = of(qualifier);
    }

    const service = this.injector.inject(config.service, null);

    if (!service) {
      return throwError(() => new Error(`No service found for entity ${type}`));
    }

    return qualifier$.pipe(
      switchMap((qualifier) => {
        return service.get(qualifier) as Observable<E>;
      })
    );
  }

  getField<T = unknown>(
    entity: EntityFieldQualifier<T>
  ): Observable<T | undefined> {
    return this.get(entity).pipe(
      map((value) => this.pickField(value, entity.field))
    );
  }

  protected getConfig(type: string): EntityProvider {
    return this.injector.inject(`${EntityProvider}${type}`, null);
  }

  protected pickField(obj: any, fieldPath: string): any {
    if (!fieldPath) {
      return obj;
    }

    const fields = fieldPath.split('.');
    let currentObj = obj;

    for (const field of fields) {
      if (currentObj[field] === undefined) {
        return null;
      }
      currentObj = currentObj[field];
    }

    return currentObj;
  }
}
