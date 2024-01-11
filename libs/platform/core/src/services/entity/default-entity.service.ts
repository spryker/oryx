import { INJECTOR, inject } from '@spryker-oryx/di';
import {
  Observable,
  combineLatest,
  map,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { ContextService } from '../context';
import { EntityProvider, isCustomEntityProvider } from './entity-provider';
import { EntityContext } from './entity.context';
import {
  EntityFieldQualifier,
  EntityQualifier,
  EntityService,
} from './entity.service';

enum GetMethod {
  Single = 'get',
  List = 'getList',
}

export class DefaultEntityService implements EntityService {
  protected injector = inject(INJECTOR);
  protected contextService = inject(ContextService);

  get<E = unknown, Q = unknown>({
    qualifier,
    element,
    type,
  }: EntityQualifier<Q>): Observable<E | undefined> {
    return this.resolveConfig<E, Q>({ element, type }).pipe(
      switchMap(({ config, type }) => {
        const qualifier$: Observable<Q | undefined> = qualifier
          ? of(qualifier)
          : this.resolveQualifier({ type, element }, config);

        return qualifier$.pipe(
          switchMap((qualifier) =>
            qualifier
              ? (this.resolveServiceOrFactory<E, Q>(
                  config,
                  qualifier
                ) as Observable<E | undefined>)
              : of(undefined)
          )
        );
      })
    );
  }

  getList<E = unknown, Q = unknown>({
    qualifier,
    element,
    type,
  }: EntityQualifier<Q>): Observable<E[] | undefined> {
    return this.resolveConfig<E, Q>({ element, type }).pipe(
      switchMap(({ config, type }) => {
        return this.resolveServiceOrFactory<E, Q>(
          config,
          qualifier!,
          GetMethod.List
        ) as Observable<E[] | undefined>;
      })
    );
  }

  getListQualifiers<E = unknown, Q = unknown>(
    entity: EntityQualifier<Q>
  ): Observable<(Q | undefined)[] | undefined> {
    return this.getList(entity).pipe(
      switchMap((values) =>
        values?.length
          ? combineLatest(
              values.map((value) =>
                this.contextService.distill<E, Q>(entity.type!, value as E)
              )
            )
          : of(values as Q[])
      )
    );
  }

  getField<T = unknown>(
    entity: EntityFieldQualifier<T>
  ): Observable<T | undefined> {
    return this.get(entity).pipe(
      map((value) => this.pickField(value, entity.field))
    );
  }

  getQualifier<E = unknown, Q = unknown>({
    element,
    type,
  }: Omit<EntityQualifier<Q>, 'qualifier'>): Observable<{
    type: string;
    qualifier: Q | undefined;
  }> {
    return this.resolveConfig<E, Q>({ element, type }).pipe(
      switchMap(({ config, type }) => {
        return this.resolveQualifier({ type, element }, config).pipe(
          map((qualifier) => ({ type, qualifier }))
        );
      })
    );
  }

  getContextKey(type: string): Observable<string | null> {
    return of(
      this.injector.inject(`${EntityProvider}${type}`, null)?.context ??
        type ??
        null
    );
  }

  protected resolveConfig<E = unknown, Q = unknown>({
    element,
    type,
  }: Pick<EntityQualifier<Q>, 'element' | 'type'>): Observable<{
    config: EntityProvider<E, Q>;
    type: string;
  }> {
    let type$: Observable<string | undefined>;

    if (!type) {
      type$ = this.contextService.get<string>(element ?? null, EntityContext);
    } else {
      type$ = of(type);
    }

    return type$.pipe(
      map((type) => {
        if (!type) {
          throw new Error(`No type resolved and no type provided for entity`);
        }

        const config = this.getConfig<E, Q>(type);

        if (!config) {
          throw new Error(`No entity provider found for entity ${type}`);
        }
        return { config, type };
      })
    );
  }

  protected resolveQualifier<E = unknown, Q = unknown>(
    { type, element }: Pick<EntityQualifier<Q>, 'type' | 'element'>,
    { context }: EntityProvider<E, Q>
  ): Observable<Q | undefined> {
    return this.contextService.get<Q>(element ?? null, context ?? type!);
  }

  protected getConfig<E, Q>(type: string): EntityProvider<E, Q> {
    return this.injector.inject(`${EntityProvider}${type}`, null);
  }

  protected resolveServiceOrFactory<E, Q>(
    provider: EntityProvider<E, Q>,
    qualifier: Q,
    method: GetMethod = GetMethod.Single
  ): Observable<E | E[] | undefined> {
    if (!isCustomEntityProvider(provider)) {
      const service = this.injector.inject<{
        [method: string]: (q?: Q) => Observable<E>;
      } | null>(provider.service!, null);
      if (!service) {
        return throwError(
          () => new Error(`No service found for entity ${provider.service}`)
        );
      }
      return service[method](qualifier);
    } else {
      const service = provider.service
        ? this.injector.inject<{ get: (q?: Q) => Observable<E> } | null>(
            provider.service,
            null
          )
        : this.injector;
      return provider[method]?.(service, qualifier) ?? of(undefined);
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
