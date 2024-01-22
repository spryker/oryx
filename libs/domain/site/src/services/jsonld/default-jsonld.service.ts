import {
  ContextService,
  EntityService,
  TransformerService,
} from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { JSONLD, jsonLdTokenFactory } from '@spryker-oryx/site';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import { JsonLdService } from './jsonld.service';

export class DefaultJsonLdService implements JsonLdService {
  protected contextService = inject(ContextService);
  protected entityService = inject(EntityService);
  protected transformer = inject(TransformerService);

  getSchemas(): Observable<JSONLD[] | undefined> {
    return this.contextService.get<string>(null, 'entity').pipe(
      switchMap((entity: string | undefined) =>
        entity
          ? this.entityService.get({ type: entity }).pipe(
              this.transformer.do<JSONLD>(jsonLdTokenFactory(entity)),
              map((x) => [x] as JSONLD[]),
              catchError(() => of(undefined))
            )
          : of()
      )
    );
  }
}
