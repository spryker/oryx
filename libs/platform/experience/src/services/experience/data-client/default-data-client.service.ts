/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  AppRef,
  ComponentsPlugin,
  ComponentStaticSchema,
  FeatureOptionsService,
  ResourcePlugin,
} from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { merge, Observable, of, shareReplay, switchMap, tap } from 'rxjs';
import {
  ComponentSchema,
  componentSchemaKey,
  optionsKey,
} from '../../../decorators';
import { catchMessage, postMessage } from '../utilities';
import { MessageType } from './data-client.model';
import { ExperienceDataClientService } from './data-client.service';

interface ProductsSuggestion {
  products: {
    name?: string;
    sku?: string;
  }[];
}

export class DefaultExperienceDataClientService
  implements ExperienceDataClientService
{
  constructor(
    protected appRef = inject(AppRef),
    protected optionsService = inject(FeatureOptionsService),
    protected suggestionService = inject('oryx.SuggestionService', null)
  ) {}

  protected schemas$ = of(this.appRef.findPlugin(ComponentsPlugin)).pipe(
    switchMap((componentPlugin) => componentPlugin!.getComponentSchemas()),
    tap((schemas) => {
      postMessage({
        type: MessageType.Schemas,
        data: schemas.map(
          ({ schema, type }) =>
            ({
              type,
              ...((schema as ComponentStaticSchema)[componentSchemaKey] ??
                (schema as unknown as Partial<ComponentSchema>)),
            } as ComponentSchema)
        ),
      });
    })
  );
  protected options$ = catchMessage(MessageType.ComponentType).pipe(
    tap((type) => {
      const componentPlugin = this.appRef.findPlugin(ComponentsPlugin)!;

      postMessage({
        type: MessageType.Options,
        data: {
          ...componentPlugin!.getComponentClass(type)?.[optionsKey],
          ...this.optionsService.getFeatureOptions(type),
        },
      });
    })
  );
  protected graphics$ = of(
    this.appRef.findPlugin(ResourcePlugin)?.getResources()
  ).pipe(
    tap((resources) => {
      postMessage({
        type: MessageType.Graphics,
        data: Object.keys(resources?.graphics ?? {}),
      });
    })
  );
  protected products$ = catchMessage(MessageType.Query).pipe(
    switchMap<string, Observable<ProductsSuggestion | null>>(
      (query) => this.suggestionService?.get({ query }) ?? of(null)
    ),
    tap((suggestions) => {
      postMessage({
        type: MessageType.Products,
        data: (suggestions?.products ?? []).map(({ name, sku }) => ({
          name,
          sku,
        })),
      });
    })
  );
  protected initializer$ = merge(
    this.options$,
    this.graphics$,
    this.products$,
    this.schemas$
  ).pipe(shareReplay({ bufferSize: 1, refCount: true }));

  initialize(): Observable<unknown> {
    return this.initializer$;
  }
}
