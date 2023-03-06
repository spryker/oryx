/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  AppRef,
  ComponentsPlugin,
  FeatureOptionsService,
  ResourcePlugin,
} from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { merge, Observable, of, shareReplay, switchMap, tap } from 'rxjs';
import { optionsKey } from '../../../decorators';
import { ContentComponentSchema } from '../../../models';
import { ExperienceStaticData, StaticComponent } from '../static-data';
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
    protected suggestionService = inject('oryx.SuggestionService', null),
    protected staticData = inject(ExperienceStaticData, [])
  ) {}

  protected schemas$ = of(this.appRef.findPlugin(ComponentsPlugin)).pipe(
    switchMap((componentPlugin) => componentPlugin!.getComponentSchemas()),
    tap((schemas) => {
      postMessage({
        type: MessageType.Schemas,
        data: schemas as ContentComponentSchema[],
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
    switchMap<string, Observable<ProductsSuggestion | undefined>>(
      (query) => this.suggestionService?.get({ query }) ?? of(undefined)
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
  protected colorMode$ = catchMessage(MessageType.ColorMode).pipe(
    tap((mode) => {
      window.dispatchEvent(
        new CustomEvent('oryx.toggle-mode', {
          bubbles: true,
          composed: true,
          detail: mode,
        })
      );
    })
  );
  protected initializer$ = merge(
    this.options$,
    this.graphics$,
    this.products$,
    this.schemas$,
    this.colorMode$
  ).pipe(shareReplay({ bufferSize: 1, refCount: true }));

  initialize(): Observable<unknown> {
    return this.initializer$;
  }

  sendStatic(data: StaticComponent[]): void {
    postMessage({
      type: MessageType.Static,
      data,
    });
  }
}
