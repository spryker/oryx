
import { INJECTOR, inject } from '@spryker-oryx/di';
import { Observable, map, of, switchMap, throwError } from 'rxjs';
import {
  EntityFieldQualifier,
  EntityProvider,
  EntityQualifier,
  EntityService,
} from './entity.service';
import { ContextService } from '../context';

export class DefaultEntityService implements EntityService {
  protected injector = inject(INJECTOR);
  protected context = inject(ContextService, null);

  get<E = unknown, T = unknown>({
    qualifier,
    element,
    type,
  }: EntityQualifier<T>): Observable<E> {
    const config = this.getConfig(type);

    if (!config) {
      return throwError(
        () => new Error(`No entity provider found for entity ${type}`)
      );
    }

    let qualifier$: Observable<T>;

    if (!qualifier) {
      // resolve qualifier from context

      if (!config.context) {
        return throwError(
          () => new Error(`No context or qualifier provided for entity ${type}`)
        );
      }

      qualifier$ = this.context.get(element, config.context);
    } else {
      qualifier$ = of(qualifier);
    }

    const service = this.injector.inject<{ get: (q: T) => Observable<E> }>(
      config.service,
      null
    );

    if (!service) {
      return throwError(() => new Error(`No service found for entity ${type}`));
    }

    return qualifier$.pipe(
      switchMap((qualifier) => {
        return service.get(qualifier) as Observable<E>;
      })
    );
  }

  getField<T = unknown>(entity: EntityFieldQualifier<T>): Observable<T> {
    // TODO: add support for nested fields
    return this.get(entity).pipe(map((value) => value?.[entity.field] as T));
  }

  protected getConfig(entity: string): EntityProvider {
    return this.injector.inject(`${EntityProvider}${entity}`, null);
  }
}
