import { INJECTOR, inject } from '@spryker-oryx/di';
import { Observable, map, of, switchMap, throwError } from 'rxjs';
import { ContextService } from '../context';
import { EntityProvider, isCustomEntityProvider } from './entity-provider';
import {
  EntityFieldQualifier,
  EntityQualifier,
  EntityService,
} from './entity.service';

export class DefaultEntityService implements EntityService {
  protected injector = inject(INJECTOR);
  protected context = inject(ContextService);

  get<E = unknown, Q = unknown>({
    qualifier,
    element,
    type,
  }: EntityQualifier<Q>): Observable<E | undefined> {
    const config = type ? this.getConfig<E, Q>(type) : null;
    console.log(config, 'config');
    if (!config) {
      return throwError(
        () => new Error(`No entity provider found for entity ${type}`)
      );
    }

    let qualifier$: Observable<Q | undefined>;

    if (!qualifier) {
      if (!config.context) {
        return throwError(
          () => new Error(`No context or qualifier provided for entity ${type}`)
        );
      }
      qualifier$ = this.context.get(element ?? null, config.context);
    } else {
      qualifier$ = of(qualifier);
    }

    return qualifier$.pipe(
      switchMap((qualifier) => {
        console.log(qualifier, 'qualifierqualifier');
        return qualifier
          ? this.resolveServiceOrFactory<E, Q>(config, qualifier)
          : of(undefined);
      })
    );
  }

  getField<T = unknown>(
    entity: EntityFieldQualifier<T>
  ): Observable<T | undefined> {
    return this.get(entity).pipe(
      map((value) => {
        console.log(value, 'value');
        return this.pickField(value, entity.field);
      })
    );
  }

  getContextKey(type: string): Observable<string | null> {
    return of(this.injector.inject(`${EntityProvider}${type}`, null)?.context);
  }

  protected getConfig<E, Q>(type: string): EntityProvider<E, Q> {
    return this.injector.inject(`${EntityProvider}${type}`, null);
  }

  protected resolveServiceOrFactory<E, Q>(
    provider: EntityProvider<E, Q>,
    qualifier: Q
  ): Observable<E | undefined> {
    if (!isCustomEntityProvider(provider)) {
      const service = this.injector.inject<{
        get: (q?: Q) => Observable<E>;
      } | null>(provider.service!, null);
      if (!service) {
        return throwError(
          () => new Error(`No service found for entity ${provider.service}`)
        );
      }
      return service.get(qualifier);
    } else {
      const service = provider.service
        ? this.injector.inject<{ get: (q?: Q) => Observable<E> } | null>(
            provider.service,
            null
          )
        : this.injector;
      return provider.resolve(service, qualifier);
    }
  }

  protected pickField(obj: any, fieldPath?: string): any {
    if (!fieldPath || !obj) {
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
