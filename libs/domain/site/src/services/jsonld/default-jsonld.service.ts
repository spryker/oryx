import { ContextService, EntityService } from '@spryker-oryx/core';
import { INJECTOR, inject } from '@spryker-oryx/di';
import {
  JSONLD,
  JsonLdNormalizer,
  jsonLdTokenFactory,
} from '@spryker-oryx/site';
import { Observable, combineLatest, filter, of, switchMap } from 'rxjs';
import { JsonLdService } from './jsonld.service';

export class DefaultJsonLdService implements JsonLdService {
  protected injector = inject(INJECTOR);
  protected contextService = inject(ContextService);
  protected entityService = inject(EntityService);
  protected normalizers = inject(JsonLdNormalizer);

  getSchemas(): Observable<JSONLD[]> {
    return this.contextService
      .get<string>(null, 'entity')
      .pipe(
        switchMap((entity) =>
          entity
            ? this.entityService
                .get({ type: entity })
                .pipe(switchMap((value) => this.normalize(entity, value)))
            : of()
        )
      );
  }

  protected normalize(entity: string, value?: unknown): Observable<JSONLD[]> {
    const normalizers = this.findMatchingNormalizer(entity);

    // TODO: we should be able to return undefined, but it wont' emit a new value somehow...
    if (!normalizers.length) return of([]);
    return combineLatest(
      normalizers.map(
        (normalizer) =>
          normalizer
            .normalize(value)
            .pipe(filter((value) => value !== undefined)) as Observable<JSONLD>
      )
    );
  }

  protected findMatchingNormalizer(entity: string): JsonLdNormalizer[] {
    const token = jsonLdTokenFactory(entity);
    return this.injector.inject(token, []);
  }
}
